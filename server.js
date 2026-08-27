import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataFilePath = path.join(__dirname, 'data', 'birthdayConfig.json');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS & JSON parsing
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ensure upload directories exist
const photosDir = path.join(rootDir, 'public', 'assets', 'photos');
const giftsDir = path.join(rootDir, 'public', 'assets', 'gifts');
const musicDir = path.join(rootDir, 'public', 'assets', 'music');
const dataDir = path.join(__dirname, 'data');

[photosDir, giftsDir, musicDir, dataDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const target = req.query.type === 'gift' ? giftsDir : photosDir;
    cb(null, target);
  },
  filename: (req, file, cb) => {
    const originalExt = path.extname(file.originalname) || '.jpg';
    const cleanName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    cb(null, cleanName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
});

// GET /api/birthday - Fetch current birthday configuration
app.get('/api/birthday', (req, res) => {
  try {
    if (fs.existsSync(dataFilePath)) {
      const raw = fs.readFileSync(dataFilePath, 'utf-8');
      const data = JSON.parse(raw);
      return res.json({ success: true, data });
    }
    res.status(404).json({ success: false, message: 'Configuration not found' });
  } catch (error) {
    console.error('Error reading configuration:', error);
    res.status(500).json({ success: false, message: 'Failed to read birthday config' });
  }
});

// POST /api/birthday - Update configuration
app.post('/api/birthday', (req, res) => {
  try {
    const updatedData = req.body;
    if (!updatedData || typeof updatedData !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2), 'utf-8');
    console.log('✅ Configuration successfully updated');
    res.json({ success: true, message: 'Birthday config updated successfully!', data: updatedData });
  } catch (error) {
    console.error('Error saving configuration:', error);
    res.status(500).json({ success: false, message: 'Failed to save configuration' });
  }
});

// POST /api/upload - Upload single photo / gift
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const folder = req.query.type === 'gift' ? 'gifts' : 'photos';
    const relativeUrl = `/assets/${folder}/${req.file.filename}`;
    res.json({
      success: true,
      message: 'File uploaded successfully',
      url: relativeUrl,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, message: 'File upload failed' });
  }
});

// POST /api/upload-multiple - Upload multiple WhatsApp / camera photos at once
app.post('/api/upload-multiple', upload.array('files', 50), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const folder = req.query.type === 'gift' ? 'gifts' : 'photos';
    const uploadedFiles = req.files.map((file) => ({
      url: `/assets/${folder}/${file.filename}`,
      filename: file.filename,
      originalName: file.originalname,
    }));
    console.log(`✅ Uploaded ${uploadedFiles.length} photos to /public/assets/${folder}/`);
    res.json({
      success: true,
      message: `${uploadedFiles.length} files uploaded successfully`,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    res.status(500).json({ success: false, message: 'Multiple file upload failed' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🎂 Birthday Backend Server running at http://localhost:${PORT}`);
});
