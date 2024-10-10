import express, { Router } from 'express';
import upload from '../service/multer'
import { extractPDF, getFile, uploadPdf } from '../controller/pdfController';

const pdfRoute: Router = express.Router();

pdfRoute.post('/upload', upload.single('file'), uploadPdf)
pdfRoute.get('/pdf/:fileId',getFile)
pdfRoute.get('/extract/:fileId/:pages', extractPDF);

export default pdfRoute

