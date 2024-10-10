"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("../service/multer"));
const pdfController_1 = require("../controller/pdfController");
const pdfRoute = express_1.default.Router();
pdfRoute.post('/upload', multer_1.default.single('file'), pdfController_1.uploadPdf);
pdfRoute.get('/pdf/:fileId', pdfController_1.getFile);
pdfRoute.get('/extract/:fileId/:pages', pdfController_1.extractPDF);
exports.default = pdfRoute;
