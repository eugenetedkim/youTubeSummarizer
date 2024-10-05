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
const cors_1 = __importDefault(require("cors"));
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_2 = require("child_process");
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
// Function to get the path to the virtual environment's Python interpreter
function getVenvPythonPath() {
    const venvPath = path_1.default.join(__dirname, 'venv');
    const isWindows = process.platform === 'win32';
    const pythonPath = isWindows
        ? path_1.default.join(venvPath, 'Scripts', 'python.exe')
        : path_1.default.join(venvPath, 'bin', 'python');
    if (!fs_1.default.existsSync(pythonPath)) {
        console.error(`Virtual environment Python not found at ${pythonPath}`);
        console.error('Please create a virtual environment by running:');
        console.error('python3 -m venv venv');
        console.error('Then activate it and install the required packages.');
        process.exit(1);
    }
    return pythonPath;
}
// Function to run Whisper
function runWhisper(filePath) {
    return new Promise((resolve, reject) => {
        const pythonPath = getVenvPythonPath();
        const whisperProcess = (0, child_process_2.spawn)(pythonPath, ['-m', 'whisper', filePath, '--model', 'medium', '--verbose', 'True']);
        let transcription = '';
        whisperProcess.stdout.on('data', (data) => {
            const dataStr = data.toString();
            console.log(`Whisper Progress: ${dataStr.trim()}`);
            // Capture the transcription
            const lines = dataStr.split('\n');
            for (const line of lines) {
                if (line.includes(']')) {
                    transcription += line.split(']')[1].trim() + ' ';
                }
            }
        });
        whisperProcess.stderr.on('data', (data) => {
            const errorStr = data.toString();
            console.error(`Whisper Error: ${errorStr.trim()}`);
        });
        whisperProcess.on('close', (code) => {
            if (code === 0) {
                console.log('Whisper processing completed successfully.');
                if (transcription) {
                    resolve(transcription.trim());
                }
                else {
                    reject('No transcription captured');
                }
            }
            else {
                console.error(`Whisper process exited with code ${code}`);
                reject(`Whisper process exited with code ${code}`);
            }
        });
    });
}
// Middleware
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY
});
app.post('/api/submit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const input = req.body.input;
    console.log('Received input: ', input);
    if (!input) {
        return res.status(400).send('No URL provided');
    }
    const command = `yt-dlp --extract-audio --audio-format mp3 -o '${path_1.default.join(downloadsDir, "%(title)s.%(ext)s")}' '${input}'`;
    console.log('Executing yt-dlp command...');
    (0, child_process_1.exec)(command, (error, stdout, stderr) => __awaiter(void 0, void 0, void 0, function* () {
        if (error) {
            console.error(`yt-dlp error: ${error}`);
            return res.status(500).send(`Error downloading audio: ${error}`);
        }
        console.log(`yt-dlp stdout: ${stdout}`);
        console.error(`yt-dlp stderr: ${stderr}`);
        console.log('Checking for downloaded file...');
        fs_1.default.readdir(downloadsDir, (err, files) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.error('Error listing downloaded files:', err);
                return res.status(500).send('Failed to locate downloaded audio');
            }
            const downloadedFile = files.find(file => file.endsWith('.mp3'));
            if (!downloadedFile) {
                console.error('No audio file found');
                return res.status(404).send('No audio file found');
            }
            const filePath = path_1.default.join(downloadsDir, downloadedFile);
            console.log(`Processing downloaded file: ${filePath}`);
            try {
                console.log('Starting Whisper transcription...');
                const transcriptionText = yield runWhisper(filePath);
                console.log('Whisper transcription completed.');
                console.log('Transcription:', transcriptionText);
                console.log('Removing audio file...');
                fs_1.default.unlink(filePath, unlinkErr => {
                    if (unlinkErr) {
                        console.error('Error deleting the audio file:', unlinkErr);
                    }
                    else {
                        console.log('Audio file deleted successfully.');
                    }
                });
                console.log('Starting OpenAI summarization...');
                const completion = yield openai.chat.completions.create({
                    messages: [
                        { role: 'system', 'content': `Please summarize this transcript and return as non-nested bullet points. Do not included anything about the speaker to subscribe, comment, or anything in regards to requesting anything from the viewer: ${transcriptionText}` },
                        { role: 'system', 'content': `Based on the transcript provided which you summarized into bullet points, what action do you recommend me I do as a result of this information.` },
                    ],
                    model: 'gpt-4'
                });
                const summaryText = completion.choices[0].message.content;
                console.log('OpenAI summarization completed.');
                res.send({
                    message: 'Successfully summarized transcription',
                    summary: summaryText,
                });
            }
            catch (error) {
                console.error('Error during processing:', error);
                return res.status(500).send('Failed to process audio');
            }
        }));
    }));
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Using Python from: ${getVenvPythonPath()}`);
});
