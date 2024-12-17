import pkg from 'librespot-node';
const { Librespot } = pkg;
import { Logger } from '../utils/logger.js';
import { AudioController } from '../utils/audio-controller.js';

export class LibrespotPlayer {
  constructor(config) {
    this.config = config;
    this.deviceId = null;
    this.player = null;
    this.audioController = new AudioController(config);
  }

  async initialize() {
    try {
      const audioConfig = {
        device: this.config.audio.device,
        format: this.config.audio.format,
        rate: this.config.audio.rate
      };

      // Initialize audio controller first
      await this.audioController.initialize();

      this.player = new Librespot({
        deviceName: this.config.spotify.deviceName,
        deviceType: 'speaker',
        audio: audioConfig
      });

      await this.player.connect({
        username: this.config.spotify.username,
        password: this.config.spotify.password
      });

      this.deviceId = await this.player.getDeviceId();
      Logger.info('Player initialized with device ID:', this.deviceId);
    } catch (error) {
      Logger.error('Failed to initialize player:', error);
      throw error;
    }
  }

  async setVolume(volume) {
    return await this.audioController.setVolume(volume);
  }

  getVolume() {
    return this.audioController.getCurrentVolume();
  }

  async cleanup() {
    try {
      if (this.player) {
        await this.player.disconnect();
        this.player = null;
        this.deviceId = null;
      }
    } catch (error) {
      Logger.error('Error during player cleanup:', error);
    }
  }
}