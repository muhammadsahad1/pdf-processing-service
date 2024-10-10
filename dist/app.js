"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const pdfRoute_1 = __importDefault(require("./routes/pdfRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
console.log(process.env.CORS_ORIGIN);
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST']
}));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send("hellow aliens");
});
app.use('/api', pdfRoute_1.default);
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
