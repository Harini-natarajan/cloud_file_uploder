const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.static('public'));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;

  cloudinary.uploader.upload(filePath, { folder: "uploads" })
    .then(result => {
      fs.unlinkSync(filePath); // delete local file
      res.json({ url: result.secure_url });
    })
    .catch(error => {
      console.error("Upload failed:", error);
      res.status(500).json({ error: "Upload failed" });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
