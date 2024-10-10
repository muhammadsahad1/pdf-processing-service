import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import pdfRoute from './routes/pdfRoute'
dotenv.config()

const app = express()

const PORT = process.env.PORT || 3001
console.log(process.env.CORS_ORIGIN)

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST']
}))
app.use(express.json());
app.get('/', (req, res) => {
    res.send("hellow aliens")
})


app.use('/api', pdfRoute)

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))