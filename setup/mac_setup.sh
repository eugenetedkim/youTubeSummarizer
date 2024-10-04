#!/bin/bash

# Check if Homebrew is installed
if ! command -v brew &> /dev/null
then
    echo "Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "Homebrew is already installed."
fi

# Install Python 3.9
echo "Installing Python 3.9..."
brew install python@3.9

# Create virtual environment
echo "Creating virtual environment..."
python3.9 -m venv ~/whisper_venv

# Activate virtual environment
source ~/whisper_venv/bin/activate

# Upgrade pip and install required packages
echo "Installing required packages..."
pip install --upgrade pip
pip install openai-whisper yt-dlp

echo "Setup completed successfully!"
echo "To activate the virtual environment, run: source ~/whisper_venv/bin/activate"