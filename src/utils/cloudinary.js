// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

// // Ensure that the environment variables are set
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadOnCloudinary = async (localFilePath) => {
//   // Function to upload a file to Cloudinary
//   try {
//     if (!localFilePath) {
//       throw new Error("No file path provided for upload.");
//     }

//     // Upload the file to Cloudinary

//     const responce = await cloudinary.uploader.upload(localFilePath, {
//       // Specify the local file path
//       resource_type: "auto",
//     });
//     // Delete the local file after upload
//     fs.unlinkSync(localFilePath);
//     // Return the response containing the file URL and other details
//     return responce;
//   } catch (error) {
//     fs.unlinkSync(localFilePath); // Delete the local file if upload fails
//     return null;
//     console.log(`Error uploading file to Cloudinary: ${error.message}`);
//   }
// };
// export { uploadOnCloudinary };

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    //console.log("file is uploaded on cloudinary ", response.url);

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export { uploadOnCloudinary };
