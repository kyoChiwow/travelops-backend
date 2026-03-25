import { v2 as cloudinary } from "cloudinary";
import { envVars } from "./env";

// Frontend --> Form Data with Image file --> Multer --> Form Data --> Req (Body, file)

// Our folder --> Image --> Form Data --> File --> Multer --> Stores inside temp folder --> Req.file

// Req.file --> Cloudinary (req.file) --> Gives us URL --> Mongoose --> MongoDB

// After using multer-storage-cloudinary
// Our Folder --> Image --> Form Data --> File --> Multer --> Store inside temp folder (inside cloudinary) --> URL --> req.file --> URL --> req.file --> Mongoose --> MongoDB

cloudinary.config({
    cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
})

export const cloudinaryUpload = cloudinary;

