const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const app = express();
const port = process.env.PORT || 3000;

const apiKey = '1ff40cf9e6f8b41e59ed57237b8c611c7';

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

// Handle photo uploads and API call
app.post('/upload', upload.array('photos', 2), async (req, res) => {
  try {
    const files = req.files;
    console.log('Files received:', files);

    const formData = new FormData();
    formData.append('file1', fs.createReadStream(files[0].path));
    formData.append('file2', fs.createReadStream(files[1].path));
    formData.append('api_key', apiKey);

    const response = await axios.post('https://api.runwayml.com/v1/generate_by_image_and_description', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (response.data && response.data.url) {
      const videoUrl = response.data.url;
      res.send(`<video controls src="${videoUrl}"></video>`);
    } else {
      throw new Error('API response does not contain video URL');
    }
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).send('Error processing files: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
