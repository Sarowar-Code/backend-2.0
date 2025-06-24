// asyncHandler is a higher-order function that takes another function (requestHandler)
// and returns a new function that handles errors from async operations automatically.
const asyncHandler = (requestHandler) => {
  // This returned function takes the usual Express request, response, and next parameters
  (req, res, next) => {
    // It runs the requestHandler function and wraps it in Promise.resolve()
    // to catch any async errors (rejected promises).
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err)); // If there's an error, pass it to Express's error handler
  };
};

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next)
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

export { asyncHandler };

// higher Order function
// const asyncHandler = () => {}
// const asyncHandler = (fn) => {() => {}} // next step we will remove the {} .
// const asyncHandler = (fn) => () => {} // here we go!!!
