const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
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

    // Prepare the form data to send to the AI API
    const formData = new FormData();
    formData.append('image1', fs.createReadStream(files[0].path));
    formData.append('image2', fs.createReadStream(files[1].path));

    // Send request to AI API
    const response = await axios.post('https://api.runwayml.com/v1/your-endpoint', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': 'Bearer API_KEY'
      }
    });

    const resultUrl = response.data.result_url; // Assuming the API returns a URL to the processed image

    // Clean up uploaded files
    fs.unlinkSync(files[0].path);
    fs.unlinkSync(files[1].path);

    res.json({ resultUrl });
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).send('Error processing files');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
