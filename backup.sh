#!/bin/bash

# Create backup directory
BACKUP_DIR="backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup configuration
cp -r config "$BACKUP_DIR/"
cp -r logs "$BACKUP_DIR/"

# Create archive
tar -czf "${BACKUP_DIR}.tar.gz" "$BACKUP_DIR"
rm -rf "$BACKUP_DIR"

echo "Backup created: ${BACKUP_DIR}.tar.gz"