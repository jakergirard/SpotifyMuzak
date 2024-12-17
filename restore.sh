#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: ./restore.sh <backup-file.tar.gz>"
    exit 1
fi

# Extract backup
tar -xzf "$1"
BACKUP_DIR=$(basename "$1" .tar.gz)

# Restore configuration
cp -r "$BACKUP_DIR/config" .
cp -r "$BACKUP_DIR/logs" .

# Cleanup
rm -rf "$BACKUP_DIR"

# Restart service
sudo systemctl restart spotify-connect

echo "Restore complete!"