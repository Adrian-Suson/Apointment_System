// config/upload.js

import multer from 'multer';
import path from 'path';

// Multer configuration to store the file with only the filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'assets/'); // Directory where the files will be stored
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // Get the file extension
    const fileName = `${Date.now()}${fileExtension}`; // Generate a unique filename using current timestamp
    cb(null, fileName); // Store only the filename
  }
});

// Initialize multer with the defined storage configuration
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
}).single('avatar'); // Expect a single file with the field name 'avatar'

export default upload;
