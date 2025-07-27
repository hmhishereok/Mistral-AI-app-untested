#!/bin/bash

# AWS EC2 Deployment Script for ReceiptScanner Pro
# Run this script on your EC2 instance after connecting via SSH

set -e  # Exit on any error

echo "🚀 Starting ReceiptScanner Pro deployment to AWS EC2..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Detect OS
if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
else
    print_error "Cannot detect OS"
    exit 1
fi

print_status "Detected OS: $OS $VER"

# Update system
print_status "Updating system packages..."
if [[ "$OS" == *"Amazon Linux"* ]]; then
    sudo yum update -y
elif [[ "$OS" == *"Ubuntu"* ]]; then
    sudo apt update && sudo apt upgrade -y
else
    print_error "Unsupported OS: $OS"
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
if [[ "$OS" == *"Amazon Linux"* ]]; then
    sudo yum install -y python3 python3-pip git nginx
elif [[ "$OS" == *"Ubuntu"* ]]; then
    sudo apt install -y python3 python3-pip python3-venv git nginx
fi

# Create application directory
APP_DIR="/home/$(whoami)/Mistral_Receipt_OCR"
print_status "Setting up application directory: $APP_DIR"

if [ ! -d "$APP_DIR" ]; then
    print_warning "Application directory not found. Please clone your repository first:"
    echo "git clone https://github.com/your-username/Mistral_Receipt_OCR.git $APP_DIR"
    echo "Then run this script again."
    exit 1
fi

cd "$APP_DIR"

# Create Python virtual environment
print_status "Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p receipts/temp
chmod 755 receipts/temp

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file..."
    cat > .env << EOF
MISTRAL_API_KEY=your_mistral_api_key_here
DEBUG=false
ENVIRONMENT=production
CORS_ORIGINS=http://localhost:19006,http://localhost:8081,http://3.25.119.39:8000,https://yourdomain.com
EOF
    print_warning "Please update the MISTRAL_API_KEY in .env file with your actual API key"
fi

# Create systemd service
print_status "Creating systemd service..."
sudo tee /etc/systemd/system/receipt-scanner.service << EOF
[Unit]
Description=ReceiptScanner Pro FastAPI
After=network.target

[Service]
Type=exec
User=$(whoami)
Group=$(whoami)
WorkingDirectory=$APP_DIR
Environment=PATH=$APP_DIR/venv/bin
ExecStart=$APP_DIR/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
print_status "Enabling and starting service..."
sudo systemctl daemon-reload
sudo systemctl enable receipt-scanner
sudo systemctl start receipt-scanner

# Check service status
print_status "Checking service status..."
if sudo systemctl is-active --quiet receipt-scanner; then
    print_status "Service is running successfully!"
else
    print_error "Service failed to start. Check logs with: sudo journalctl -u receipt-scanner"
    exit 1
fi

# Configure nginx
print_status "Configuring nginx..."
sudo tee /etc/nginx/sites-available/receipt-scanner << EOF
server {
    listen 80;
    server_name _;

    # Proxy API requests to FastAPI
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Default location
    location / {
        return 301 /api/;
    }
}
EOF

# Enable nginx site
if [ -d /etc/nginx/sites-enabled ]; then
    sudo ln -sf /etc/nginx/sites-available/receipt-scanner /etc/nginx/sites-enabled/
fi

# Test nginx configuration
sudo nginx -t

# Start nginx
print_status "Starting nginx..."
sudo systemctl enable nginx
sudo systemctl start nginx

# Configure firewall
print_status "Configuring firewall..."
if command -v ufw &> /dev/null; then
    # Ubuntu
    sudo ufw allow ssh
    sudo ufw allow 'Nginx Full'
    sudo ufw allow 8000
    sudo ufw --force enable
elif command -v iptables &> /dev/null; then
    # Amazon Linux
    sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
    sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
    sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
    sudo iptables -A INPUT -p tcp --dport 8000 -j ACCEPT
    sudo service iptables save
fi

# Get instance IP
INSTANCE_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
if [ -z "$INSTANCE_IP" ]; then
    INSTANCE_IP=$(curl -s http://169.254.169.254/latest/meta-data/local-ipv4)
fi

print_status "Deployment completed successfully!"
echo ""
echo "🌐 Your application is now accessible at:"
echo "   - Direct API: http://$INSTANCE_IP:8000"
echo "   - Through nginx: http://$INSTANCE_IP"
echo ""
echo "📋 Useful commands:"
echo "   - Check service status: sudo systemctl status receipt-scanner"
echo "   - View logs: sudo journalctl -u receipt-scanner -f"
echo "   - Restart service: sudo systemctl restart receipt-scanner"
echo "   - Check nginx status: sudo systemctl status nginx"
echo ""
echo "⚠️  Don't forget to:"
echo "   1. Update MISTRAL_API_KEY in .env file"
echo "   2. Configure your domain name (optional)"
echo "   3. Set up SSL certificate (optional)"
echo "   4. Configure monitoring and backups"
echo ""
print_status "Deployment script completed! 🎉" 