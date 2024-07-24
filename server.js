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
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handle photo uploads
app.post('/upload', upload.array('photos', 2), async (req, res) => {
  try {
    const files = req.files;
    console.log('Files received:', files);
    // Simulate processing by renaming files
    const processedFiles = files.map(file => {
      const newPath = path.join(file.destination, 'processed-' + file.filename);
      fs.renameSync(file.path, newPath);
      return newPath;
    });

    res.send(`Files processed successfully: ${processedFiles.join(', ')}`);
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).send('Error processing files');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
