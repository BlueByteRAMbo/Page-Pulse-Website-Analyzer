import urlValidator from '../validators/urlValidator.js';
import { analyzePage } from '../services/analyzerService.js';

/**
 * POST /api/analyze
 */
export async function analyze(req, res) {
  const { url } = req.body;

  const validation = urlValidator.validate(url);
  if (!validation.valid) {
    return res.status(validation.statusCode).json({
      success: false,
      error: {
        message: validation.message,
        code: validation.code,
      },
    });
  }

  const data = await analyzePage(url);

  return res.status(200).json({
    success: true,
    data,
  });
}
