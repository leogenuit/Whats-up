// config/cloudinary.config.js

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// connecting to your cloudinary account with the provided credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
// cloudinary: SAAS platform specialized in image hosting
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    folder: "squad-1010", // The name of the folder in cloudinary
    // resource_type: 'raw' => this is in case you want to upload other type of files, not just images
  },
});

// multer is really responsible to manage the incoming file (from the client)
// designed to parse file from the request and associate it to req.file / req.files
module.exports = multer({ storage });
