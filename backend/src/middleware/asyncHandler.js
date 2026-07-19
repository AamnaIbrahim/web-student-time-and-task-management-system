// Wraps an async route handler so any thrown error (or rejected promise —
// e.g. a failed database call) is automatically forwarded to next(),
// which hands it to the centralized errorHandler middleware. Without
// this, every single controller function would need its own try/catch
// block just to avoid unhandled promise rejections crashing requests.
export function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}