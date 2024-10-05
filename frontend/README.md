# YouTube Summarizer Frontend

This is the frontend application for the YouTube Summarizer project. It provides a user interface for interacting with the YouTube video summarization features.

## Project Setup

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), providing a solid foundation for React development.

### Prerequisites

- Node.js (version 14 or later)
- npm (usually comes with Node.js)

### Installation

1. Navigate to the frontend directory:
   ```
   cd path/to/youTubeSummarizer/frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```

## Running the Application

In the project directory, you can run:

### `npm start`

- Runs the app in development mode.
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
- The page will automatically reload if you make edits.
- You will see any lint errors in the console.

## Development Workflow

1. Start the development server with `npm start`.
2. Make changes to the React components in the `src` directory.
3. Test your changes locally in the browser.

## Project Structure

- `src/`: Contains all React source code
  - `components/`: React components (e.g., `TextInput.tsx`)
  - `App.tsx`: Main application component
  - `index.tsx`: Entry point of the React application
- `public/`: Static files like HTML and images

## Connecting to Backend

- The backend server is configured to run on `http://localhost:5000` by default.
- Ensure the backend server is running before starting the frontend application.
- If you need to change the backend URL, update it in `src/App.tsx` where the fetch request is made.
- Double-check the port number in the backend's `server.ts` file if you're unsure about the correct port.

## Features

- Input field for YouTube URL submission
- Display of summarized content from the backend
- Error handling for invalid inputs or backend issues

## Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)

## Troubleshooting

If you encounter any issues:

1. Ensure all dependencies are installed (`npm install`)
2. Clear npm cache (`npm cache clean --force`)
3. Ensure the backend server is running and accessible
4. Check the browser console and terminal for any error messages
5. Verify that the backend URL in `App.tsx` matches your backend server address and port
6. If changing ports, make sure to update both the backend `server.ts` and frontend `App.tsx` files

For any persistent problems, please open an issue in the project repository.

## Contributing

Contributions to improve the frontend are welcome. Please ensure to follow the existing code style and add unit tests for any new features.