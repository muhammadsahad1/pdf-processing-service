"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageConfig = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const ASSETS_DIR = path_1.default.join(__dirname, '..', 'assets');
const UPLOADS_DIR = path_1.default.join(ASSETS_DIR, 'uploads');
const EXTRACTED_DIR = path_1.default.join(ASSETS_DIR, 'extracted');
fs_extra_1.default.ensureDirSync(UPLOADS_DIR);
fs_extra_1.default.ensureDirSync(EXTRACTED_DIR);
exports.storageConfig = {
    ASSETS_DIR,
    UPLOADS_DIR,
    EXTRACTED_DIR,
    MAX_FILE_SIZE: 10 * 1024 * 1024,
    ALLOWED_MIME_TYPES: ['application/pdf']
};
