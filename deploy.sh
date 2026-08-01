#!/bin/bash

echo "Updating system and installing dependencies..."
sudo yum update -y
sudo yum install -y git
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

echo "Cloning repository..."
rm -rf AGRI-MOIST-SOIL-DASHBOARD
git clone https://github.com/ommaurya2580-beep/AGRI-MOIST-SOIL-DASHBOARD.git

echo "Setting up backend..."
cd AGRI-MOIST-SOIL-DASHBOARD/backend

echo "Creating .env file..."
cat << 'EOF' > .env
MONGO_URI=mongodb+srv://ommaurya2581_db_user:DJsg9V3fdGVw6x7A@agri-moist-soil-dashboa.lx9of2m.mongodb.net/iot_dashboard?retryWrites=true&w=majority&appName=AGRI-MOIST-SOIL-DASHBOARD
PORT=80
EOF

echo "Installing npm packages..."
npm install

echo "Starting server with PM2..."
sudo npm install -g pm2
# Stop any existing server if re-deploying
sudo pm2 stop server || true
sudo pm2 delete server || true

# We need sudo to bind to port 80
sudo pm2 start server.js --name "iot-backend"

echo "Deployment finished successfully!"
