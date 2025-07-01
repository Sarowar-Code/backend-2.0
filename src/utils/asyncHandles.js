const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err)); // If there's an
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
