import { Request, Response, Router } from 'express'
import upload from '../service/multer'

const pdfRoute = (router: Router): Router => {

    router.post('/upload', upload.single('file'))

    return router
}

