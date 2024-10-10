import { Request, Response } from 'express'
import { error, PDFDocument } from 'pdf-lib'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs/promises';

export const uploadPdf = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("upload call vann")
        console.log(req.file);

        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' })
            return
        }

        const fileId = uuidv4()
        const newPath = path.join(__dirname, '..', 'uploads', `${fileId}.pdf`)
        console.log(newPath)
        await fs.rename(req.file.path, newPath)
        res.json({ fileId })


    } catch (error) {
        res.status(500).json({ error: 'Failed to process upload' })
        return
    }
}

export const getFile = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("calledddd")
        const { fileId } = req.params
        console.log("id=>", fileId)
        const filePath = path.join(__dirname, '..', 'uploads', `${fileId}.pdf`);

        if (!(await fs.stat(filePath)).isFile()) {
            res.status(404).json({ error: 'File not found' })
            return
        }
        console.log("filePath ==>", filePath)
        res.sendFile(filePath);
    } catch (error) {
        res.status(404).json({ error: 'PDF not found' })
    }
}


export const extractPDF = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Extracting ", req.params);
       
        const { fileId, pages } = req.params;
        if (!fileId || !pages) {
            res.status(400).json({ error: 'FileId and pages are required' });
            return;
        }

        const pageNumbers = pages.split(',').map(Number);
        const filePath = path.join(__dirname, '..', 'uploads', `${fileId}.pdf`);

        let pdfBytes: Buffer;
        try {
            pdfBytes = await fs.readFile(filePath);
        } catch (error) {
            console.error("Error reading file:", error);
            res.status(404).json({ error: 'File not found' });
            return;
        }

       
        let pdfDoc: PDFDocument;
        try {
            pdfDoc = await PDFDocument.load(pdfBytes);
   
        } catch (error) {
            console.error("Error loading PDF:", error);
            res.status(500).json({ error: 'Invalid PDF file' });
            return;
        }

        const newPdfDoc = await PDFDocument.create();
        
        for (const pageNum of pageNumbers) {
            if (pageNum <= 0 || pageNum > pdfDoc.getPageCount()) {
                res.status(400).json({ 
                    error: `Invalid page number: ${pageNum}. Document has ${pdfDoc.getPageCount()} pages.`
                });
                return;
            }
            
            const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
            newPdfDoc.addPage(copiedPage);
        }

        // Save and send the new PDF
        const newPdfBytes = await newPdfDoc.save();
        console.log("New PDF created successfully");
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=extracted.pdf');
        res.send(Buffer.from(newPdfBytes));

    } catch (error) {
        console.error("Extraction failed:", error);
        res.status(500).json({ 
            error: 'Failed to extract pages',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};