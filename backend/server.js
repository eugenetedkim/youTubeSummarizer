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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); // Enables Cross-Origin Resource Sharing (CORS) to allow requests from different origins (e.g., frontend on a different domain/port)
const { exec } = require('child_process');
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
require('dotenv').config();
const openai_1 = __importDefault(require("openai"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
};
// Downloads directory
const downloadsDir = path_1.default.join(__dirname, 'downloads');
// Ensure the downloads directory exists
if (!fs_1.default.existsSync(downloadsDir)) {
    fs_1.default.mkdirSync(downloadsDir, { recursive: true });
}
// Middleware
// Enable CORS using corsOptions
app.use((0, cors_1.default)(corsOptions));
// Handle preflight requests for all routes
app.options('*', (0, cors_1.default)());
app.use(express_1.default.json()); // Replaces bodyParser.json()
app.use(express_1.default.urlencoded({ extended: true })); // Replaced bodyParser.urlencoded()
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY
});
// Routes and respective route handlers
app.post('/api/submit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const input = req.body.input; // Assuming 'input' is the YouTube URL
    console.log('Received input: ', input);
    if (!input) {
        return res.status(400).send('No URL provided');
    }
    const command = `yt-dlp --extract-audio --audio-format mp3 -o '${path_1.default.join(downloadsDir, "%(title)s.%(ext)s")}' '${input}'`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(`Error downloading audio: ${error}`);
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        // Check if the mp3 file exists
        fs_1.default.readdir(downloadsDir, (err, files) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error('Error listing downloaded files:', err);
                return res.status(500).send('Failed to locate downloaded audio');
            }
            // If it exits, grab the name
            const downloadedFile = files.find(file => file.endsWith('.mp3'));
            if (!downloadedFile) {
                return res.status(404).send('No audio file found');
            }
            const filePath = path_1.default.join(downloadsDir, downloadedFile);
            // Use OpenAI
            console.log(`Processing downloaded file: ${filePath}`);
            // let transcriptionText = '';
            // try {
            //   const transcription = await openai.audio.transcriptions.create({
            //     file: fs.createReadStream(filePath),
            //     model: "whisper-1",
            //   });
            //   console.log(transcription.text);
            //   transcriptionText = transcription.text;
            //   console.log(typeof(transcriptionText));
            //   // Remove the file after processing
            //   fs.unlink(filePath, unlinkErr => {
            //     if (unlinkErr) {
            //       console.error('Error deleting the audio file:', unlinkErr);
            //       return res.status(500).send('Failed to clean up audio file');
            //     }
            //   });
            // } catch(transcriptionError) {
            //   console.error('Error during transcription:', transcriptionError);
            //   return res.status(500).send('Failed to transcribe audio');
            // }
            // try {
            //   const completion = await openai.chat.completions.create({
            //     messages: [
            //       { role: 'system', 'content': `Please summarize this transcript and return as non-nested bullet points. Do not included anything about the speaker to subscribe, comment, or anything in regards to requesting anything from the viewer: ${transcriptionText}`},
            //       { role: 'system', 'content': `Based on the transcript provided which you summarized into bullet points, what action do you recommend me I do as a result of this information.`},
            //     ],
            //     model: 'gpt-4o'
            //   });
            //   const summaryText = completion['choices'][0];
            //   console.log(summaryText);
            //   res.send({
            //     message: 'Successfully summarized transcription',
            //     summary: summaryText,
            //   });
            // } catch(summarizationError) {
            //   console.error('Error during summarization:', summarizationError);
            //   return res.status(500).send('Failed to summarize transcription');
            // }
        }));
    });
}));
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
