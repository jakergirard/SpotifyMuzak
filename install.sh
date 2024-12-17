#!/bin/bash

# Install system dependencies
sudo apt-get update
sudo apt-get install -y build-essential pkg-config libasound2-dev

# Install Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install project dependencies
npm install

# Create systemd service
sudo tee /etc/systemd/system/spotify-connect.service << EOF
[Unit]
Description=Spotify Connect Player
After=network.target

[Service]
ExecStart=/usr/bin/node /home/pi/spotify-connect-player/src/index.js
WorkingDirectory=/home/pi/spotify-connect-player
StandardOutput=inherit
StandardError=inherit
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl enable spotify-connect
sudo systemctl start spotify-connect