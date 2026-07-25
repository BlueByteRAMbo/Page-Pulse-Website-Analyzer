/**
 * Wraps an async route handler so that any thrown error is forwarded
 * to Express's next(err) instead of becoming an unhandled rejection.
 *
 * @param {Function} fn - Async Express route handler
 * @returns {Function}
 */
const asyncWrapper = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncWrapper;
