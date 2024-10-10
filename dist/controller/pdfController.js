"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPDF = exports.getFile = exports.uploadPdf = void 0;
const pdf_lib_1 = require("pdf-lib");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const uploadPdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("upload call vann");
        console.log(req.file);
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        const fileId = (0, uuid_1.v4)();
        const newPath = path_1.default.join(__dirname, '..', 'uploads', `${fileId}.pdf`);
        console.log(newPath);
        yield promises_1.default.rename(req.file.path, newPath);
        res.json({ fileId });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to process upload' });
        return;
    }
});
exports.uploadPdf = uploadPdf;
const getFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("calledddd");
        const { fileId } = req.params;
        console.log("id=>", fileId);
        const filePath = path_1.default.join(__dirname, '..', 'uploads', `${fileId}.pdf`);
        if (!(yield promises_1.default.stat(filePath)).isFile()) {
            res.status(404).json({ error: 'File not found' });
            return;
        }
        console.log("filePath ==>", filePath);
        res.sendFile(filePath);
    }
    catch (error) {
        res.status(404).json({ error: 'PDF not found' });
    }
});
exports.getFile = getFile;
const extractPDF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Extracting....");
        console.log("Extracting ", req.params);
        const { fileId, pages } = req.params;
        if (!fileId || !pages) {
            res.status(400).json({ error: 'FileId and pages are required' });
            return;
        }
        const pageNumbers = pages.split(',').map(Number);
        const filePath = path_1.default.join(__dirname, '..', 'uploads', `${fileId}.pdf`);
        console.log("FilePath:", filePath);
        // Read the PDF file
        let pdfBytes;
        try {
            pdfBytes = yield promises_1.default.readFile(filePath);
            console.log("File read successfully");
        }
        catch (error) {
            console.error("Error reading file:", error);
            res.status(404).json({ error: 'File not found' });
            return;
        }
        // Load the PDF document
        let pdfDoc;
        try {
            pdfDoc = yield pdf_lib_1.PDFDocument.load(pdfBytes);
            console.log("PDF document loaded successfully");
        }
        catch (error) {
            console.error("Error loading PDF:", error);
            res.status(500).json({ error: 'Invalid PDF file' });
            return;
        }
        // Create new PDF with selected pages
        const newPdfDoc = yield pdf_lib_1.PDFDocument.create();
        for (const pageNum of pageNumbers) {
            if (pageNum <= 0 || pageNum > pdfDoc.getPageCount()) {
                res.status(400).json({
                    error: `Invalid page number: ${pageNum}. Document has ${pdfDoc.getPageCount()} pages.`
                });
                return;
            }
            console.log(`Copying page ${pageNum}`);
            const [copiedPage] = yield newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
            newPdfDoc.addPage(copiedPage);
        }
        // Save and send the new PDF
        const newPdfBytes = yield newPdfDoc.save();
        console.log("New PDF created successfully");
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=extracted.pdf');
        res.send(Buffer.from(newPdfBytes));
    }
    catch (error) {
        console.error("Extraction failed:", error);
        res.status(500).json({
            error: 'Failed to extract pages',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.extractPDF = extractPDF;
