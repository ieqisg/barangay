@echo off
REM Quick start script for Barangay backend and frontend

echo.
echo ===============================================
echo Barangay Request Management System - Setup
echo ===============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed. Please install Node.js 16+ first.
    echo Download from: https://nodejs.org/
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if MongoDB is running
echo Checking MongoDB connection...
mongosh --eval "db.adminCommand('ping')" --quiet >nul 2>&1
if errorlevel 1 (
    echo WARNING: MongoDB is not accessible at localhost:27017
    echo Please ensure MongoDB is running:
    echo   - Local: Check Windows Services for "MongoDB Server"
    echo   - Cloud: Verify MongoDB Atlas connection string in backend/.env
    echo.
) else (
    echo ✓ MongoDB is accessible
    echo.
)

REM Setup backend
echo Setting up backend...
cd backend
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

if not exist ".env" (
    echo Creating backend .env file from template...
    copy .env.example .env >nul
    echo ✓ Created backend/.env (edit with your MongoDB URI)
)

cd ..

REM Setup frontend
echo.
echo Setting up frontend...
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

if not exist ".env" (
    echo Creating frontend .env file...
    (
        echo REACT_APP_API_URL=http://localhost:5000
    ) > .env
    echo ✓ Created frontend/.env
)

echo.
echo ===============================================
echo Setup Complete!
echo ===============================================
echo.
echo To start development:
echo.
echo Terminal 1 - Backend (API Server):
echo   cd backend
echo   npm start
echo.
echo Terminal 2 - Frontend (React App):
echo   npm start
echo.
echo Then open http://localhost:3000 in your browser
echo.
echo For MongoDB setup help, see: MONGODB_SETUP.md
echo.
