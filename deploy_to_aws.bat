@echo off
REM AWS EC2 Deployment Script for ReceiptScanner Pro (Windows)
REM This script helps prepare your local files for AWS deployment

echo 🚀 Preparing ReceiptScanner Pro for AWS EC2 deployment...

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

REM Create deployment package
echo 📦 Creating deployment package...

REM Create a deployment directory
if exist deployment mkdir deployment
cd deployment

REM Copy necessary files
echo 📋 Copying application files...
xcopy /E /I /Y ..\backend backend\
xcopy /E /I /Y ..\main.py .\
xcopy /E /I /Y ..\requirements.txt .\
xcopy /E /I /Y ..\deploy_to_aws.sh .\

REM Create .env template
echo 🔧 Creating .env template...
(
echo MISTRAL_API_KEY=your_mistral_api_key_here
echo DEBUG=false
echo ENVIRONMENT=production
echo CORS_ORIGINS=http://localhost:19006,http://localhost:8081,http://3.25.119.39:8000,https://yourdomain.com
) > .env

echo ✅ Deployment package created in 'deployment' directory!

echo.
echo 📋 Next steps:
echo 1. Upload the 'deployment' folder to your EC2 instance
echo 2. SSH into your EC2 instance
echo 3. Navigate to the deployment directory
echo 4. Run: chmod +x deploy_to_aws.sh
echo 5. Run: ./deploy_to_aws.sh
echo 6. Update the MISTRAL_API_KEY in .env file
echo.
echo 🌐 Your application will be accessible at:
echo    - Direct API: http://3.25.119.39:8000
echo    - Through nginx: http://3.25.119.39
echo.

pause 