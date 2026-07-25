# Page Pulse

A full-stack web application that analyzes any publicly accessible webpage and returns a structured report with HTTP status, response time, SEO metadata, and accessibility indicators.

## Live Demo
| | |
|---|---|
| **Live Demo Link** | [Click Here to View Video](https://canva.link/7c2fb1x15gonbuq) |
| **Frontend** | [page-pulse-website-analyzer-orpin.vercel.app](https://page-pulse-website-analyzer-orpin.vercel.app/) |
| **Backend API** | [page-pulse-website-analyzer.onrender.com](https://page-pulse-website-analyzer.onrender.com/) |
| **Health check** | [`/health`](https://page-pulse-website-analyzer.onrender.com/health) |

> Backend is hosted on Render's free tier, which spins down after inactivity. The first request after a period of idle time may take 30–50s to respond while the service cold-starts — subsequent requests are fast.

---

## Features

- **HTTP Status Code** — surface real status from the target server
- **Response Time** — measured from request dispatch to first byte
- **Page Title** — extracted via Cheerio
- **Meta Description** — supports both `name="description"` and `og:description`
- **H1 Tag Count** — with SEO quality badge (optimal / missing / multiple)
- **Images Missing Alt Text** — count of `<img>` elements without an `alt` attribute
- **Approximate Word Count** — strips script/style nodes before counting
- Copy JSON output to clipboard
- Copy plain-text report to clipboard
- Graceful error states — no `alert()`, no unhandled rejections
- Animated loading state with four-step progress messages and shimmer skeletons
- Fully responsive dark-mode UI

---

## Architecture

```
page-pulse/
├── backend/           Express.js API
│   └── src/
│       ├── config/    Environment config (single source of truth)
│       ├── controllers/  Thin request handlers
│       ├── middleware/   Error handler, 404 handler
│       ├── routes/    Route definitions
│       ├── services/  Core business logic (fetch + parse)
│       ├── utils/     asyncWrapper (no scattered try/catch)
│       └── validators/ URL validation (pure, testable)
│   └── tests/         Vitest + Supertest test suite
│
└── frontend/          React (Vite) application
    └── src/
        ├── components/ Reusable UI components
        ├── hooks/      useAnalyzer, useClipboard
        ├── pages/      Home page
        ├── services/   Axios API client
        └── utils/      Error code → UI message mapper
```

---

## Design Decisions

Three decisions worth calling out, with the reasoning behind each:

### 1. `asyncWrapper` over scattered `try/catch`
Every route handler is wrapped in a single higher-order function that pipes any thrown error to Express's `next(err)`. This means controllers contain zero boilerplate error handling, and a single middleware owns the entire error-response contract. This pattern is standard in production Express codebases.

### 2. Centralized URL validation as a pure class
`UrlValidator` has no dependencies on Express and can be imported and tested in isolation. It covers all edge cases (private IPs, localhost, unsupported protocols, malformed URLs) without coupling to the HTTP layer. This makes the validation logic reusable and independently verifiable.

### 3. `useAnalyzer` hook as the single source of truth for UI state
All async state — status machine (`idle/loading/success/error`), data, error info, step animation — lives in one custom hook. Components receive plain props and contain no async logic. This separation makes the components trivially testable and the state transitions auditable in one place.

---

## Setup Instructions

**Prerequisites:** Node.js ≥ 18

```bash
# Clone the repository
git clone https://github.com/BlueByteRAMbo/Page-Pulse-Website-Analyzer
cd page-pulse
```

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Running Locally

Both services must be running simultaneously.

| Service  | Port | Command        |
|----------|------|----------------|
| Backend  | 4000 | `npm run dev`  |
| Frontend | 5173 | `npm run dev`  |

The Vite dev server is configured to proxy `/api` requests to port 4000, so no CORS configuration is needed during development.

---

## API Contract

### `POST /api/analyze`

Analyzes a publicly accessible webpage.

**Request body**

```json
{
  "url": "https://example.com"
}
```

**Success response** `200 OK`

```json
{
  "success": true,
  "data": {
    "status": 200,
    "responseTime": 341,
    "title": "Example Domain",
    "metaDescription": "This is an example page.",
    "h1Count": 1,
    "missingAltImages": 2,
    "wordCount": 621
  }
}
```

**Error response**

```json
{
  "success": false,
  "error": {
    "message": "URL is malformed or missing a protocol (http/https).",
    "code": "INVALID_URL"
  }
}
```

### Error Codes

| Code | HTTP | Meaning |
|---|---|---|
| `MISSING_URL` | 400 | No URL provided |
| `INVALID_URL` | 400 | Malformed or unparseable URL |
| `INVALID_PROTOCOL` | 400 | Non-http/https protocol |
| `PRIVATE_ADDRESS` | 403 | Localhost or private IP |
| `NOT_HTML` | 422 | Content-Type is not text/html |
| `TIMEOUT` | 504 | Request exceeded 10 s |
| `UNREACHABLE` | 502 | DNS failure or host not found |
| `NETWORK_ERROR` | 502 | Other network-layer failure |
| `SERVER_ERROR` | 500 | Internal server error |

### Health Check

```
GET /health
→ { "status": "ok" }
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `4000` | Server port |
| `NODE_ENV` | `development` | Environment |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | Comma-separated CORS origins |
| `MAX_RESPONSE_SIZE` | `5242880` | Max fetch size in bytes (5 MB) |
| `FETCH_TIMEOUT` | `10000` | Request timeout in ms |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend base URL |

---

## Testing

```bash
cd backend
npm test
```

The test suite uses **Vitest** and **Supertest**. Axios is mocked so no real network requests are made.

**Test coverage:**
- Happy path with valid HTML page
- Missing URL in request body
- Empty string URL
- Malformed URL
- Localhost URL (403)
- Private IP URL (403)
- Unsupported protocol
- Non-HTML content type (422)
- Simulated timeout (504)
- Simulated DNS failure (502)
- 404 from target server (status surfaced in report)
- Health check endpoint
- Unknown routes (404)

---

## Deployment

This project is deployed as two independent services, as reflected in the [Live Demo](#live-demo) links above.

### Backend → Render

Live at: `https://page-pulse-website-analyzer.onrender.com`

1. Create a new **Web Service** on Render
2. Connect this GitHub repository
3. Set **Root Directory** to `backend`
4. Set **Start Command** to `npm start`
5. Environment variables:
   - `NODE_ENV=production`
   - `ALLOWED_ORIGINS=https://page-pulse-website-analyzer-orpin.vercel.app`
   - `PORT` (Render sets this automatically — no need to hardcode it)

### Frontend → Vercel

Live at: `https://page-pulse-website-analyzer-orpin.vercel.app`

1. Import this repository into Vercel
2. Set **Root Directory** to `frontend`
3. Environment variable:
   - `VITE_API_BASE_URL=https://page-pulse-website-analyzer.onrender.com`
4. Deploy

To redeploy with your own instance, replace the two URLs above with your own Render/Vercel service URLs.

---

## AI-Assisted Design

The frontend UI was built in collaboration with an AI coding assistant (Google Deepmind's Antigravity). This section documents what that collaboration actually looked like — not as a disclaimer, but because it's a meaningful part of how this project came together.

### Color Palette

The initial design used an indigo/purple accent common in AI-generated UIs. After being directed to make it feel premium and OLED-appropriate, the AI proposed a concrete replacement palette rather than a vague suggestion:

| Token | Value | Reasoning |
|---|---|---|
| Background | `#000000` | True OLED black — no purple tint |
| Surface | `#0c0c0c` / `#141414` | Layered depth without colour casts |
| Accent | `#38bdf8` (sky blue) | Premium, distinct from purple, legible on black |
| Success | `#34d399` (emerald) | High contrast on dark backgrounds |
| Warning | `#fbbf24` (amber) | Readable without being aggressive |
| Error | `#f87171` (soft red) | Signals failure without alarming |

Every colour was chosen to work on OLED panels — no gradients, no purple, no generic defaults.

### Component Architecture

One decision worth calling out explicitly: the AI proposed splitting the HTTP status display into its own dedicated `StatusCard` component rather than rendering it as a standard `MetricCard`. The reasoning was that HTTP status is the *primary* output of a webpage analyzer — it deserves dominant visual weight. The result is a full-width card with a dynamic left accent bar, a large monospaced status number, and a short human-readable description, all colour-coded by status class (2xx green, 3xx blue, 4xx amber, 5xx red). That hierarchy decision came from reasoning about the product's purpose, not from a UI template.

### Icon Semantic Mapping

When replacing emoji placeholders with proper SVG icons, the AI selected icons from `lucide-react` based on meaning, not aesthetics alone:

| Metric | Icon | Rationale |
|---|---|---|
| HTTP Status | `Activity` (waveform) | Implies live monitoring, not static data |
| Response Time | `Zap` | Speed and energy — universally understood |
| H1 Tags | `Heading1` | Literal semantic match to the HTML element |
| Missing Alt Text | `ImageOff` | Broken/missing image — immediately legible |
| Word Count | `BookOpen` | Reading and content quantity |
| Page Title | `Tag` | Labelling and metadata |
| Meta Description | `AlignLeft` | Text content and structure |

### What AI Accelerated vs. What Required Human Direction

AI handled the implementation work that would typically take the most time: generating a consistent design system in one pass, wiring up accessible markup (`aria-*` attributes, `role`, `aria-live`) without being asked, diagnosing the Tailwind v4 `@import` ordering bug, and converting the entire backend from CJS to ESM to unblock the test suite.

What required human direction: the decision to reject the purple palette, the call to prioritise the status card visually, the choice of OLED aesthetics as the target, and the overall product framing. The AI accelerated execution; the design intent came from feedback.

---

## Future Improvements

- **Caching layer** — Redis cache keyed by URL (TTL ~60 s) to avoid hammering frequently analyzed domains
- **Rate limiting** — `express-rate-limit` per IP to prevent abuse
- **Report history** — LocalStorage-persisted analysis history with timestamps
- **More SEO metrics** — canonical URL, Open Graph tags, structured data detection
- **Lighthouse score integration** — performance and accessibility scoring via Lighthouse CI API

---

*Built for [Digital Heroes Training Task](https://digitalheroesco.com)*