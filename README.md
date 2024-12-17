# Spotify Connect Player for Raspberry Pi

A dockerized Spotify Connect endpoint that automatically maintains continuous playback.

## Features

- Fully containerized solution
- Automatic restart on failures
- Survives system reboots
- Easy backup and restore
- HiFiBerry DAC+ ADC Pro support
- Continuous playback using Spotify's recommendation engine

## Prerequisites

- Raspberry Pi (any model)
- HiFiBerry DAC+ ADC Pro
- Spotify Premium account
- Spotify Developer API credentials

## Installation

1. Clone this repository to your Raspberry Pi:
   ```bash
   git clone https://github.com/yourusername/spotify-connect-player
   cd spotify-connect-player
   ```

2. Run the setup script:
   ```bash
   chmod +x setup-pi.sh
   ./setup-pi.sh
   ```

3. Edit the configuration:
   ```bash
   nano config/config.json
   ```

4. Restart the service:
   ```bash
   sudo systemctl restart spotify-connect
   ```

## Configuration

Edit `config/config.json` with your settings:
- Spotify credentials
- Audio device settings
- Autoplay preferences
- Fallback playlist ID

## Maintenance

### Backup
```bash
./backup.sh
```

### Restore
```bash
./restore.sh backup-20231010-123456.tar.gz
```

### View Logs
```bash
docker-compose logs -f
```

### Update
```bash
git pull
docker-compose build --no-cache
docker-compose up -d
```

## Troubleshooting

1. Check service status:
   ```bash
   sudo systemctl status spotify-connect
   ```

2. View logs:
   ```bash
   docker-compose logs -f
   ```

3. Restart service:
   ```bash
   sudo systemctl restart spotify-connect
   ```