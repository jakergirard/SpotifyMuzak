#!/bin/bash

# Exit on any error
set -e

echo "Setting up Spotify Connect Player..."

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker pi
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo apt-get update
    sudo apt-get install -y docker-compose
fi

# Create required directories
mkdir -p config logs

# Copy config template if not exists
if [ ! -f config/config.json ]; then
    cp config.json config/config.json
fi

# Enable the built-in audio output
sudo amixer cset numid=3 1

# Create systemd service for auto-start
sudo tee /etc/systemd/system/spotify-connect.service << EOF
[Unit]
Description=Spotify Connect Player Container
Requires=docker.service
After=docker.service

[Service]
WorkingDirectory=/home/pi/spotify-connect-player
ExecStart=/usr/bin/docker-compose up
ExecStop=/usr/bin/docker-compose down
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl enable spotify-connect
sudo systemctl start spotify-connect

echo "Setup complete! Please edit config/config.json with your Spotify credentials."