@echo off

echo Installing Python...
powershell -Command "Invoke-WebRequest -Uri https://www.python.org/ftp/python/3.9.7/python-3.9.7-amd64.exe -OutFile python-3.9.7-amd64.exe"
python-3.9.7-amd64.exe /quiet InstallAllUsers=1 PrependPath=1

echo Navigating to backend directory...
cd backend

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing required packages...
pip install --upgrade pip
pip install -r requirements.txt

echo Installing Node.js dependencies...
npm install

echo Backend setup completed successfully!

echo Navigating to frontend directory...
cd ..\frontend

echo Installing frontend dependencies...
npm install

echo Frontend setup completed successfully!
echo Setup process complete. Please set up your .env file in the backend directory.
echo To activate the virtual environment, run: backend\venv\Scripts\activate.bat