export default function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.originalUrl} not found.`,
      code: 'NOT_FOUND',
    },
  });
}
