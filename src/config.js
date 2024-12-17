import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateSpotifyConfig, validateAudioConfig } from './utils/config-validator.js';
import { Logger } from './utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadConfig() {
  try {
    const configPath = path.join(__dirname, '..', 'config.json');
    const configFile = await fs.readFile(configPath, 'utf-8');
    const config = JSON.parse(configFile);
    
    // Validate configuration
    validateSpotifyConfig(config);
    validateAudioConfig(config);
    
    // Override with environment variables if present
    if (process.env.SPOTIFY_USERNAME) config.spotify.username = process.env.SPOTIFY_USERNAME;
    if (process.env.SPOTIFY_PASSWORD) config.spotify.password = process.env.SPOTIFY_PASSWORD;
    if (process.env.SPOTIFY_CLIENT_ID) config.spotify.clientId = process.env.SPOTIFY_CLIENT_ID;
    if (process.env.SPOTIFY_CLIENT_SECRET) config.spotify.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    
    return config;
  } catch (error) {
    Logger.error('Failed to load configuration:', error);
    throw error;
  }
}