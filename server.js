const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    console.log('Uploading file:', file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle photo uploads
app.post('/api/upload', upload.array('photos', 2), async (req, res) => {
  try {
    const files = req.files;
    console.log('Files received:', files);
    res.send('Photos uploaded. Please process them manually in RunwayML and upload the result.');
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).send('Error processing files');
  }
});

// Handle processed video upload
app.post('/api/uploadVideo', upload.single('video'), (req, res) => {
  try {
    const file = req.file;
    console.log('Processed video uploaded:', file);
    res.send('Video uploaded successfully');
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).send('Error uploading video');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app; // This line is crucial for Vercel deployment
