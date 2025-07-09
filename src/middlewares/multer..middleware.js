// import multer from "multer";
// // This middleware is used to handle file uploads in an Express application.
// // It uses the multer library to configure storage options and handle file uploads.

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "/public/temp");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// export const upload = multer({ storage });

import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
