/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import stream from "stream";
import AppError from "../errorHelpers/appError";
import { envVars } from "./env";

// Frontend --> Form Data with Image file --> Multer --> Form Data --> Req (Body, file)

// Our folder --> Image --> Form Data --> File --> Multer --> Stores inside temp folder --> Req.file

// Req.file --> Cloudinary (req.file) --> Gives us URL --> Mongoose --> MongoDB

// After using multer-storage-cloudinary
// Our Folder --> Image --> Form Data --> File --> Multer --> Store inside temp folder (inside cloudinary) --> URL --> req.file --> URL --> req.file --> Mongoose --> MongoDB

cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET,
});

// Delete Function for Cloudinary
export const deleteImageFromCloudinary = async (url: string) => {
  try {
    const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

    const match = url.match(regex);
    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id);
      console.log(`File ${public_id} is deleted from cloudinary!`);
    }
  } catch (error: any) {
    throw new AppError(401, "Cloudinary image deletion failed!", error.message);
  }
};
// Delete Function for Cloudinary

// Upload Function for Cloudinary
export const uploadBufferFromCloudinary = async (
  buffer: Buffer,
  fileName: string,
): Promise< UploadApiResponse | undefined > => {
  try {
    return new Promise((resolve, reject) => {
      const public_id = `pdf/${fileName}-${Date.now()}`;

      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);

      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            public_id,
            folder: "pdf",
          },
          (err, result) => {
            if (err) {
              return reject(err);
            } else {
              resolve(result);
            }
          },
        )
        .end(buffer);
    });
  } catch (error: any) {
    console.log(error);
    throw new AppError(401, `Error uploading file!${error.message}`);
  }
};
// Upload Function for Cloudinary

export const cloudinaryUpload = cloudinary;
