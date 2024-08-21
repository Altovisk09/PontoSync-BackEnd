const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Diretório de uploads
const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads'); // Ajusta o caminho para o diretório de uploads

// Certifique-se de que o diretório de uploads exista
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuração do armazenamento do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Diretório para armazenar os arquivos
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Nome do arquivo
  }
});

// Função para verificar se o arquivo é um PDF
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== '.pdf') {
    return cb(new Error('Somente arquivos PDF são permitidos'), false);
  }
  cb(null, true);
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
