import { exec } from 'child_process';
import { promisify } from 'util';
import { Logger } from './logger.js';

const execAsync = promisify(exec);

export class AudioController {
  constructor(config) {
    this.config = config;
    this.currentVolume = config.audio.volume.initial;
  }

  async initialize() {
    try {
      await this.setVolume(this.currentVolume);
      Logger.info(`Initialized audio controller with volume: ${this.currentVolume}%`);
    } catch (error) {
      Logger.error('Failed to initialize audio controller:', error);
      throw error;
    }
  }

  async setVolume(volume) {
    try {
      // Ensure volume is within bounds
      const boundedVolume = Math.min(
        Math.max(0, volume),
        this.config.audio.volume.max
      );
      
      // Set system volume using amixer
      await execAsync(`amixer set PCM ${boundedVolume}%`);
      this.currentVolume = boundedVolume;
      
      Logger.info(`Volume set to ${boundedVolume}%`);
      return boundedVolume;
    } catch (error) {
      Logger.error('Failed to set volume:', error);
      throw error;
    }
  }

  getCurrentVolume() {
    return this.currentVolume;
  }
}