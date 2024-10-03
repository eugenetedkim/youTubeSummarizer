# Backend Server for YouTube Summarizer App

## Description
This backend server handles API requests for the YouTube Summarizer App. It includes a route for handling the YouTube audio download, performing speech recognition, and summarizing using Chat GPT.

## Installation
Clone the repository and run:
```bash
npm install
npx tsc
node server.js
```

## Notes
Use the Whisper model by OpenAI to convert an audio file downloaded with `youtube-dl` into text. `youtube-dl` is a powerful, open-source command-line tool that allows yout o download videos from YouTube and many other video hosting sites. Whisper is a robust, state-of-the-art automatic speech recognition (ASR) system that can handle various audio inputs and languages to generate transcriptions.

### Step 1: Install youtube-dl
```bash
# For macOS
brew install youtube-dl

# For Ubuntu/Linux
sudo apt update
sudo apt install youtube-dl
```

### Step 2: Download Audio with youtube-dl
Use `youtube-dl` to download the audio from a YouTube video. You can specify the format to be an audio-only format like mp3 or best audio format available:
```bash
youtube-dl --extract-audio --audio-format mp3 -o "%(title)s.%(ext)s" <YouTube-Video-URL>
```

I did the above but got a HTTP Error 403: Forbidden. Therefore, I installed `yt-dlp` which is a fork of `youtube-dl` that is often more up-to-date with fixes for YouTube downloading:
```bash
brew install yt-dlp
```

Then I ran this command (youtube-dl was replaced with yt-dlp and everything remains the same):
```bash
yt-dlp --extract-audio --audio-format mp3 -o "%(title)s.%(ext)s" 'https://www.youtube.com/watch?v=AsSn-QQwzao'
```

After it downloaded, the mp3 file was there in the same directory I executed the command and I was able to play it. =D

Now I want to do it again, but from my backend Express app...which worked successfully.

Now I want to convert the mp3 file to text....


## Using the Audio API from OpenAI



