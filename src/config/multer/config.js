const multer = require('multer');
const path = require('path');
const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';
const uploadsDir = isProduction ? '/tmp/uploads' : path.resolve(__dirname, '..', '..', 'uploads');

// Certifique-se de criar o diretório no ambiente de produção
if (!isProduction) {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} else {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') {
      console.error('Erro ao criar diretório de uploads:', err);
    }
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); 
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.pdf') {
    return cb(new Error('Somente arquivos PDF são permitidos'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
