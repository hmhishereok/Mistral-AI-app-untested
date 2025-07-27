# AWS EC2 Deployment Guide for ReceiptScanner Pro

This guide will walk you through deploying your ReceiptScanner Pro application to AWS EC2.

## Prerequisites

1. AWS Account with EC2 access
2. SSH key pair for EC2 instance
3. Domain name (optional but recommended)
4. Mistral AI API key

## Step 1: Launch EC2 Instance

### 1.1 Create EC2 Instance
1. Go to AWS Console → EC2 → Launch Instance
2. Choose **Amazon Linux 2023** or **Ubuntu 22.04 LTS**
3. Select **t3.medium** or **t3.large** (minimum 2GB RAM)
4. Configure Security Group:
   - **SSH (22)**: Your IP
   - **HTTP (80)**: 0.0.0.0/0
   - **HTTPS (443)**: 0.0.0.0/0
   - **Custom TCP (8000)**: 0.0.0.0/0 (for your FastAPI app)

### 1.2 Connect to Instance
```bash
ssh -i your-key.pem ec2-user@your-instance-ip
# or for Ubuntu:
ssh -i your-key.pem ubuntu@your-instance-ip
```

## Step 2: Install Dependencies

### 2.1 Update System
```bash
sudo yum update -y  # For Amazon Linux
# or
sudo apt update && sudo apt upgrade -y  # For Ubuntu
```

### 2.2 Install Python and pip
```bash
# Amazon Linux
sudo yum install python3 python3-pip -y

# Ubuntu
sudo apt install python3 python3-pip python3-venv -y
```

### 2.3 Install Additional Dependencies
```bash
# Amazon Linux
sudo yum install git nginx -y

# Ubuntu
sudo apt install git nginx -y
```

## Step 3: Deploy Backend Application

### 3.1 Clone Your Repository
```bash
cd /home/ec2-user  # or /home/ubuntu for Ubuntu
git clone https://github.com/your-username/Mistral_Receipt_OCR.git
cd Mistral_Receipt_OCR
```

### 3.2 Set Up Python Environment
```bash
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### 3.3 Configure Environment Variables
```bash
# Create .env file
cat > .env << EOF
MISTRAL_API_KEY=your_mistral_api_key_here
DEBUG=false
ENVIRONMENT=production
CORS_ORIGINS=http://localhost:19006,http://localhost:8081,http://3.25.119.39:8000,https://yourdomain.com
EOF
```

### 3.4 Create Directories
```bash
mkdir -p receipts/temp
chmod 755 receipts/temp
```

## Step 4: Configure Systemd Service

### 4.1 Create Service File
```bash
sudo tee /etc/systemd/system/receipt-scanner.service << EOF
[Unit]
Description=ReceiptScanner Pro FastAPI
After=network.target

[Service]
Type=exec
User=ec2-user
Group=ec2-user
WorkingDirectory=/home/ec2-user/Mistral_Receipt_OCR
Environment=PATH=/home/ec2-user/Mistral_Receipt_OCR/venv/bin
ExecStart=/home/ec2-user/Mistral_Receipt_OCR/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
```

### 4.2 Enable and Start Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable receipt-scanner
sudo systemctl start receipt-scanner
sudo systemctl status receipt-scanner
```

## Step 5: Configure Nginx (Optional but Recommended)

### 5.1 Install and Configure Nginx
```bash
sudo tee /etc/nginx/sites-available/receipt-scanner << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
```

### 5.2 Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/receipt-scanner /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 6: SSL Certificate (Optional)

### 6.1 Install Certbot
```bash
# Amazon Linux
sudo yum install certbot python3-certbot-nginx -y

# Ubuntu
sudo apt install certbot python3-certbot-nginx -y
```

### 6.2 Get SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Step 7: Deploy Frontend

### 7.1 Build React Native Web App
```bash
cd frontend/fresh-receipt-scanner
npm install
npx expo export --platform web
```

### 7.2 Serve Frontend with Nginx
```bash
# Copy built files to nginx directory
sudo cp -r dist/* /var/www/html/

# Update nginx config to serve static files
sudo tee /etc/nginx/sites-available/receipt-scanner << EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Serve static frontend files
    location / {
        root /var/www/html;
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API requests to FastAPI
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo systemctl restart nginx
```

## Step 8: Monitoring and Logs

### 8.1 View Application Logs
```bash
# View service logs
sudo journalctl -u receipt-scanner -f

# View nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 8.2 Monitor System Resources
```bash
# Install monitoring tools
sudo yum install htop -y  # Amazon Linux
# or
sudo apt install htop -y   # Ubuntu

# Monitor resources
htop
df -h
free -h
```

## Step 9: Security Considerations

### 9.1 Firewall Configuration
```bash
# Configure UFW (Ubuntu)
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Configure iptables (Amazon Linux)
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 8000 -j ACCEPT
```

### 9.2 Regular Updates
```bash
# Set up automatic security updates
sudo yum install yum-cron -y  # Amazon Linux
# or
sudo apt install unattended-upgrades -y  # Ubuntu
```

## Step 10: Backup Strategy

### 10.1 Database Backup (if using database)
```bash
# Create backup script
cat > /home/ec2-user/backup.sh << EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
# Add your database backup commands here
# Example for PostgreSQL:
# pg_dump your_database > /home/ec2-user/backups/backup_\$DATE.sql
EOF

chmod +x /home/ec2-user/backup.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /home/ec2-user/backup.sh
```

## Troubleshooting

### Common Issues:

1. **Service won't start**: Check logs with `sudo journalctl -u receipt-scanner`
2. **Permission denied**: Ensure correct file permissions
3. **Port already in use**: Check with `sudo netstat -tlnp`
4. **CORS errors**: Verify CORS configuration in main.py
5. **API key issues**: Check .env file and Mistral API key

### Useful Commands:
```bash
# Restart services
sudo systemctl restart receipt-scanner
sudo systemctl restart nginx

# Check service status
sudo systemctl status receipt-scanner
sudo systemctl status nginx

# View real-time logs
sudo tail -f /var/log/nginx/error.log
sudo journalctl -u receipt-scanner -f
```

## Cost Optimization

1. **Use Spot Instances** for development/testing
2. **Reserved Instances** for production
3. **Auto Scaling Groups** for high availability
4. **CloudWatch** for monitoring and alerting

## Next Steps

1. Set up monitoring with CloudWatch
2. Configure auto-scaling
3. Set up CI/CD pipeline
4. Implement backup strategy
5. Add SSL certificate
6. Configure custom domain

Your application should now be accessible at `http://3.25.119.39:8000` or your custom domain! 