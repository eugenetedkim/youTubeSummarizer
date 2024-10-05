#!/bin/bash

# Check if Homebrew is installed
if ! command -v brew &> /dev/null
then
    echo "Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "Homebrew is already installed."
fi

# Install Python 3.9 (or latest)
echo "Installing Python..."
brew install python

# Navigate to the backend directory
cd backend

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip and install required packages
echo "Installing required packages..."
pip install --upgrade pip
pip install -r requirements.txt

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

echo "Backend setup completed successfully!"
echo "To activate the virtual environment, run: source backend/venv/bin/activate"

# Navigate to the frontend directory
cd ../frontend

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

echo "Frontend setup completed successfully!"
echo "Setup process complete. Please set up your .env file in the backend directory."