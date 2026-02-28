import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
cloudinary.config({
  cloud_name: "dmqswy5aw",   // usually lowercase in dashboard
  api_key: "986936834852219",
  api_secret: process.env.CLOUDINARY_SECRET,
});

export default cloudinary;