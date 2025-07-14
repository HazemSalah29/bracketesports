@echo off
echo 🚀 Setting up BracketEsports for local development...

REM Create environment files if they don't exist
if not exist ".env.local" (
    echo 📝 Creating frontend environment file...
    copy .env.local.example .env.local >nul
    echo ✅ Created .env.local - Please configure your settings
)

if not exist "backend\.env" (
    echo 📝 Creating backend environment file...
    copy backend\.env.example backend\.env >nul
    echo ✅ Created backend\.env - Please configure your settings
)

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo ✅ Setup complete!
echo.
echo 🔧 Next steps:
echo 1. Configure your environment files:
echo    - Edit .env.local for frontend settings
echo    - Edit backend\.env for backend settings
echo.
echo 2. Set up MongoDB:
echo    - Install MongoDB locally, OR
echo    - Create a MongoDB Atlas account and get connection string
echo.
echo 3. Start the development servers:
echo    - Backend: cd backend ^&^& npm run dev
echo    - Frontend: npm run dev
echo.
echo 🌐 Your app will be available at:
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:5000

pause
