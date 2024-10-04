@echo off

echo Installing Python 3.9...
powershell -Command "Invoke-WebRequest -Uri https://www.python.org/ftp/python/3.9.7/python-3.9.7-amd64.exe -OutFile python-3.9.7-amd64.exe"
python-3.9.7-amd64.exe /quiet InstallAllUsers=1 PrependPath=1

echo Creating virtual environment...
python -m venv %USERPROFILE%\whisper_venv

echo Activating virtual environment...
call %USERPROFILE%\whisper_venv\Scripts\activate.bat

echo Installing required packages...
pip install --upgrade pip
pip install openai-whisper yt-dlp

echo Setup completed successfully!
echo To activate the virtual environment, run: %USERPROFILE%\whisper_venv\Scripts\activate.bat