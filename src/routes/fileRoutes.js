const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fileController = require('../controllers/fileController');

// PROBLEM: We need to store files with unique names to avoid conflicts
// SOLUTION: Configure multer to store files with unique filenames
const storage = multer.diskStorage({
  // Where to store the files
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  // How to name the files
  // We prepend the current timestamp to ensure uniqueness
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create the multer instance with our configuration
// This is like creating a specialized mail processing system
const upload = multer({ storage: storage });

// PROBLEM: We need endpoints for each file operation
// SOLUTION: Define routes that connect HTTP requests to our controller functions

// GET /api/files - List all files
router.get('/', fileController.getAllFiles);

// POST /api/files/upload - Upload a new file
// upload.single('file') is middleware that processes the file in the request
// and attaches it to req.file before our controller runs
router.post('/upload', upload.single('file'), fileController.uploadFile);

// GET /api/files/download/:filename - Download a specific file
router.get('/download/:filename', fileController.downloadFile);

module.exports = router;