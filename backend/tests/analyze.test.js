import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import request from 'supertest';

// Set env vars before any module import
process.env.PORT = '4001';
process.env.NODE_ENV = 'test';
process.env.ALLOWED_ORIGINS = 'http://localhost:5173';
process.env.MAX_RESPONSE_SIZE = '5242880';
process.env.FETCH_TIMEOUT = '10000';

/**
 * Mock the httpClient utility so no real network calls are made.
 * Intercepting at this level avoids CJS/ESM axios interop issues.
 */
const httpGetMock = vi.fn();

vi.mock('../src/utils/httpClient.js', () => ({
  httpGet: httpGetMock,
}));

// ─── App Import ───────────────────────────────────────────────────────────────

let app;

beforeAll(async () => {
  const mod = await import('../src/server.js');
  app = mod.default;
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const HTML_TYPE = 'text/html; charset=utf-8';

const SAMPLE_HTML = `
<html>
  <head>
    <title>Test Page</title>
    <meta name="description" content="A test page description.">
  </head>
  <body>
    <h1>Main Heading</h1>
    <p>Hello world this is a sentence with several words in it.</p>
    <img src="a.png" alt="described">
    <img src="b.png">
    <img src="c.png">
  </body>
</html>
`;

function mockSuccess(html = SAMPLE_HTML, status = 200, contentType = HTML_TYPE) {
  httpGetMock.mockResolvedValueOnce({
    data: html,
    status,
    headers: { 'content-type': contentType },
  });
}

function mockNetworkError(code, message) {
  const err = new Error(message);
  err.code = code;
  httpGetMock.mockRejectedValueOnce(err);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('POST /api/analyze', () => {
  beforeEach(() => {
    httpGetMock.mockReset();
  });

  it('returns 400 when url is missing from body', async () => {
    const res = await request(app).post('/api/analyze').send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('MISSING_URL');
  });

  it('returns 400 for an empty string url', async () => {
    const res = await request(app).post('/api/analyze').send({ url: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('MISSING_URL');
  });

  it('returns 400 for a malformed url', async () => {
    const res = await request(app).post('/api/analyze').send({ url: 'not-a-url' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_URL');
  });

  it('returns 403 for a localhost url', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({ url: 'http://localhost:3000' });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('PRIVATE_ADDRESS');
  });

  it('returns 403 for a private IP url', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({ url: 'http://192.168.1.1' });
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('PRIVATE_ADDRESS');
  });

  it('returns 400 for an unsupported protocol', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({ url: 'ftp://example.com' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_PROTOCOL');
  });

  it('happy path — returns structured report for a valid HTML page', async () => {
    mockSuccess();

    const res = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://example.com' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const { data } = res.body;
    expect(data.status).toBe(200);
    expect(data.title).toBe('Test Page');
    expect(data.metaDescription).toBe('A test page description.');
    expect(data.h1Count).toBe(1);
    expect(data.missingAltImages).toBe(2);
    expect(typeof data.responseTime).toBe('number');
    expect(data.wordCount).toBeGreaterThan(0);
  });

  it('returns 422 when the URL points to a non-HTML resource', async () => {
    mockSuccess('%PDF-1.4...', 200, 'application/pdf');

    const res = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://example.com/doc.pdf' });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('NOT_HTML');
  });

  it('returns 504 when the request times out', async () => {
    mockNetworkError('ECONNABORTED', 'timeout of 10000ms exceeded');

    const res = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://example.com' });

    expect(res.status).toBe(504);
    expect(res.body.error.code).toBe('TIMEOUT');
  });

  it('returns 502 when the host is not found (DNS failure)', async () => {
    mockNetworkError('ENOTFOUND', 'getaddrinfo ENOTFOUND this-does-not-exist.xyz');

    const res = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://this-does-not-exist.xyz' });

    expect(res.status).toBe(502);
    expect(res.body.error.code).toBe('UNREACHABLE');
  });

  it('surfaces the real HTTP status from a 404 page response', async () => {
    mockSuccess('<html><body>Not Found</body></html>', 404);

    const res = await request(app)
      .post('/api/analyze')
      .send({ url: 'https://example.com/missing' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe(404);
  });
});

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Unknown routes', () => {
  it('returns 404 for unregistered endpoints', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
