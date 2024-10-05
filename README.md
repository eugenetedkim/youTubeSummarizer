# YouTubeSummarizer

This project is a YouTube video summarizer that transcribes and summarizes YouTube videos using Whisper for transcription and OpenAI's GPT for summarization.

## Project Structure

- `backend/`: Contains the Node.js/Express server code and Python virtual environment
- `frontend/`: Contains the React frontend code
- `setup/`: Contains setup scripts for Mac and Windows

## Prerequisites

- Node.js (v14 or later)
- Python 3.9 or later
- Git

## Setup Instructions

1. Clone this repository:
   ```
   git clone https://github.com/eugenetedkim/youTubeSummarizer.git
   cd youTubeSummarizer
   ```

2. Set up the backend:
   ```
   cd backend
   npm install
   ```

3. Create and activate a Python virtual environment:
   
   For Mac/Linux:
   ```
   python3 -m venv venv
   source venv/bin/activate
   ```
   
   For Windows:
   ```
   python -m venv venv
   .\venv\Scripts\activate
   ```

4. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Create a `.env` file in the `backend` directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

6. Set up the frontend:
   ```
   cd ../frontend
   npm install
   ```

## Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run build
   npm start
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Open a web browser and navigate to `http://localhost:3000`

## Usage

1. Enter a YouTube URL in the input field.
2. Click the submit button.
3. Wait for the video to be transcribed and summarized.
4. View the summary and recommended actions.

## Troubleshooting

If you encounter any issues during setup or usage, please check the following:

1. Ensure all prerequisites are installed correctly.
2. Make sure you've activated the virtual environment before running the backend.
3. Check that your OpenAI API key is correctly set in the `.env` file.

For any other issues, please open an issue on this GitHub repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.