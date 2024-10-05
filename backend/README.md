# Backend Server for YouTube Summarizer App

## Description
This backend server handles API requests for the YouTube Summarizer App. It includes functionality for YouTube audio download, speech recognition using Whisper, and summarization using GPT-4.

## Prerequisites
- Node.js (v14 or later)
- Python 3.9 or later
- OpenAI API key
- `yt-dlp` (for YouTube video download)
- Whisper (OpenAI's speech recognition model)

## Installation and Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

4. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Install yt-dlp:
   ```bash
   # For macOS
   brew install yt-dlp
   # For Ubuntu/Linux
   sudo apt update && sudo apt install yt-dlp
   # For Windows (using pip)
   pip install yt-dlp
   ```

6. Set up your OpenAI API key:
   - Go to https://platform.openai.com/signup to create an OpenAI account if you don't have one.
   - Once logged in, navigate to https://platform.openai.com/api-keys
   - Click on "Create new secret key" and copy the generated key.
   - Create a `.env` file in the backend directory and add your API key:
     ```
     OPENAI_API_KEY=your_api_key_here
     ```
   - Note: OpenAI API usage is not free. Ensure you've set up billing in your OpenAI account settings.

## Running the Server
1. Ensure you're in the backend directory and the virtual environment is activated.
2. Compile TypeScript:
   ```bash
   npx tsc
   ```
3. Start the server:
   ```bash
   node server.js
   ```

## API Endpoints
- `POST /api/submit`: Accepts a YouTube URL, downloads the audio, transcribes it, and returns a summary.

## Notes
- This server uses `yt-dlp` to download audio from YouTube videos.
- Whisper, an OpenAI model, is used for speech recognition.
- GPT-4 is used for summarization.
- The server expects the frontend to be running on `http://localhost:3000`.

## Troubleshooting
- If you encounter issues with `yt-dlp`, ensure it's installed and up-to-date.
- Make sure your OpenAI API key is correctly set in the `.env` file.
- Verify that your Python virtual environment is activated when running the server.
- If you encounter CORS issues, check that the `corsOptions` in `server.ts` match your frontend URL.
- Ensure that your OpenAI account has billing set up and sufficient credits.

## Development
For development, use the following process:
1. Compile TypeScript:
   ```bash
   npx tsc
   ```
2. Start the server:
   ```bash
   node server.js
   ```
3. After making changes to TypeScript files, recompile and restart the server.

For any other issues or questions, please open an issue in the project repository.