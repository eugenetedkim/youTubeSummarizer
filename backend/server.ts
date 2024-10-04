import express, { Request, Response } from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import os from 'os';
require('dotenv').config();
import OpenAI from 'openai';

const app: express.Application = express();
const PORT: string | number = process.env.PORT || 5000;
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

// Downloads directory
const downloadsDir = path.join(__dirname, 'downloads');

// Ensure the downloads directory exists
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

// Function to get the path to the virtual environment's Python interpreter
function getVenvPythonPath(): string {
  const homeDir = os.homedir();
  const venvPath = path.join(homeDir, 'whisper_venv');
  const isWindows = process.platform === 'win32';
  const pythonPath = isWindows
    ? path.join(venvPath, 'Scripts', 'python.exe')
    : path.join(venvPath, 'bin', 'python');
  
  if (!fs.existsSync(pythonPath)) {
    throw new Error(`Virtual environment Python not found at ${pythonPath}`);
  }
  
  return pythonPath;
}

// Function to run Whisper
function runWhisper(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pythonPath = getVenvPythonPath();
    const whisperProcess = spawn(pythonPath, ['-m', 'whisper', filePath, '--model', 'medium', '--verbose', 'True']);
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
        } else {
          reject('No transcription captured');
        }
      } else {
        console.error(`Whisper process exited with code ${code}`);
        reject(`Whisper process exited with code ${code}`);
      }
    });
  });
}

// Middleware
app.use(cors(corsOptions));
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/submit', async (req: Request, res: Response) => {
  const input: string = req.body.input;

  console.log('Received input: ', input);

  if (!input) {
    return res.status(400).send('No URL provided');
  }

  const command = `yt-dlp --extract-audio --audio-format mp3 -o '${path.join(downloadsDir, "%(title)s.%(ext)s")}' '${input}'`;

  console.log('Executing yt-dlp command...');
  exec(command, async (error: Error | null, stdout: string, stderr: string) => {
    if (error) {
      console.error(`yt-dlp error: ${error}`);
      return res.status(500).send(`Error downloading audio: ${error}`);
    }

    console.log(`yt-dlp stdout: ${stdout}`);
    console.error(`yt-dlp stderr: ${stderr}`);

    console.log('Checking for downloaded file...');
    fs.readdir(downloadsDir, async (err, files) => {
      if (err) {
        console.error('Error listing downloaded files:', err);
        return res.status(500).send('Failed to locate downloaded audio');
      }

      const downloadedFile = files.find(file => file.endsWith('.mp3'));
      if (!downloadedFile) {
        console.error('No audio file found');
        return res.status(404).send('No audio file found');
      }

      const filePath = path.join(downloadsDir, downloadedFile);

      console.log(`Processing downloaded file: ${filePath}`);

      try {
        console.log('Starting Whisper transcription...');
        const transcriptionText = await runWhisper(filePath);
        console.log('Whisper transcription completed.');
        console.log('Transcription:', transcriptionText);

        console.log('Removing audio file...');
        fs.unlink(filePath, unlinkErr => {
          if (unlinkErr) {
            console.error('Error deleting the audio file:', unlinkErr);
          } else {
            console.log('Audio file deleted successfully.');
          }
        });

        console.log('Starting OpenAI summarization...');
        const completion = await openai.chat.completions.create({
          messages: [
            { role: 'system', 'content': `Please summarize this transcript and return as non-nested bullet points. Do not included anything about the speaker to subscribe, comment, or anything in regards to requesting anything from the viewer: ${transcriptionText}`},
            { role: 'system', 'content': `Based on the transcript provided which you summarized into bullet points, what action do you recommend me I do as a result of this information.`},
          ],
          model: 'gpt-4'
        });

        const summaryText = completion.choices[0].message.content;
        console.log('OpenAI summarization completed.');

        res.send({
          message: 'Successfully summarized transcription',
          summary: summaryText,
        });
      } catch (error) {
        console.error('Error during processing:', error);
        return res.status(500).send('Failed to process audio');
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Using Python from: ${getVenvPythonPath()}`);
});