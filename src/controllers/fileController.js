const path = require('path');
const fs = require('fs');

// PROBLEM: Users need to see what files they have stored
// SOLUTION: This function reads the uploads directory and returns details about each file
const getAllFiles = (req, res) => {
  const uploadsDir = path.join(__dirname, '../../uploads');
  
  // Read all files in the uploads directory
  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve files' });
    }
    
    // Get file stats (size, date, etc.) - This enriches the data we return to users
    const fileDetails = files.map(filename => {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      
      return {
        name: filename,
        path: `/files/${filename}`,
        size: stats.size, // File size in bytes
        createdAt: stats.birthtime // When the file was created
      };
    });
    
    res.json(fileDetails);
  });
};

// PROBLEM: Users need to store their files in our system
// SOLUTION: This function handles the file upload process and returns metadata
const uploadFile = (req, res) => {
  // Multer already saved the file to our uploads directory
  // We just need to return success with the file details
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.status(201).json({
    message: 'File uploaded successfully',
    file: {
      name: req.file.originalname, // Original filename from the user
      path: `/files/${req.file.filename}`, // Path to access the file
      size: req.file.size, // Size in bytes
      mimetype: req.file.mimetype // File type (e.g., image/jpeg)
    }
  });
};

// PROBLEM: Users need to retrieve their files from our system
// SOLUTION: This function finds the requested file and initiates a download
const downloadFile = (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads', fileName);
  
  // First, check if the file actually exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // If file exists, send it to the user
    // The res.download() function sets the Content-Disposition header to "attachment"
    // which prompts the browser to download rather than display the file
    res.download(filePath, fileName, (err) => {
      if (err) {
        res.status(500).json({ error: 'Failed to download file' });
      }
    });
  });
};

module.exports = {
  getAllFiles,
  uploadFile,
  downloadFile
};