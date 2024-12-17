import { Logger } from '../utils/logger.js';

export class PlaybackMonitor {
  constructor(spotifyController, player) {
    this.spotifyController = spotifyController;
    this.player = player;
    this.monitorInterval = null;
  }

  start() {
    this.monitorInterval = setInterval(async () => {
      try {
        await this.checkPlaybackState();
      } catch (error) {
        Logger.error('Error monitoring playback:', error);
      }
    }, 5000);
  }

  stop() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
  }

  async checkPlaybackState() {
    const playbackState = await this.spotifyController.getCurrentPlayback();
    
    if (!playbackState || !playbackState.is_playing) {
      Logger.info('No active playback detected, starting autoplay...');
      await this.spotifyController.startAutoplay();
      return;
    }
    
    if (playbackState.device.id !== this.player.deviceId) {
      Logger.info('Transferring playback to this device');
      await this.spotifyController.transferPlayback(this.player.deviceId);
    }
  }
}