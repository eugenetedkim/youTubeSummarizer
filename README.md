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
- OpenAI API key

## Setup Instructions

1. Clone this repository:
   ```
   git clone https://github.com/eugenetedkim/youTubeSummarizer.git
   cd youTubeSummarizer
   ```

2. Run the appropriate setup script for your operating system:

   For Mac/Linux:
   ```
   chmod +x setup/mac_setup.sh
   ./setup/mac_setup.sh
   ```

   For Windows (run in Command Prompt as Administrator):
   ```
   setup\windows_setup.bat
   ```

   These scripts will set up both the backend and frontend environments.

3. Set up your OpenAI API key:
   - Go to https://platform.openai.com/signup to create an OpenAI account if you don't have one.
   - Once logged in, navigate to https://platform.openai.com/api-keys
   - Click on "Create new secret key" and copy the generated key.
   - Create a `.env` file in the `backend` directory and add your API key:
     ```
     OPENAI_API_KEY=your_api_key_here
     ```
   - Note: OpenAI API usage is not free. Ensure you've set up billing in your OpenAI account settings.

## Running the Application

1. Start the backend server:
   ```
   cd backend
   source venv/bin/activate  # For Windows: .\venv\Scripts\activate
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
4. Verify that your OpenAI account has billing set up and sufficient credits.

For any other issues, please open an issue on this GitHub repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is currently not licensed under any specific open-source license. All rights are reserved by the project owner. For more information about using or contributing to this project, please contact the project owner.