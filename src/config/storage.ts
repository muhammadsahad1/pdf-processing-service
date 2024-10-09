import path from 'path'
import fs from 'fs-extra'

const ASSETS_DIR = path.join(__dirname, '..', 'assets')
const UPLOADS_DIR = path.join(ASSETS_DIR, 'uploads');
const EXTRACTED_DIR = path.join(ASSETS_DIR, 'extracted');

fs.ensureDirSync(UPLOADS_DIR)
fs.ensureDirSync(EXTRACTED_DIR)

export const storageConfig = {
    ASSETS_DIR,
    UPLOADS_DIR,
    EXTRACTED_DIR,
    MAX_FILE_SIZE: 10 * 1024 * 1024, 
    ALLOWED_MIME_TYPES: ['application/pdf']
  };