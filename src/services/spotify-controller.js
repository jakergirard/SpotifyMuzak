import SpotifyWebApi from 'spotify-web-api-node';
import { Logger } from '../utils/logger.js';

export class SpotifyController {
  constructor(config) {
    this.config = config;
    this.api = new SpotifyWebApi({
      clientId: config.clientId,
      clientSecret: config.clientSecret
    });
  }

  async initialize() {
    try {
      const data = await this.api.clientCredentialsGrant();
      this.api.setAccessToken(data.body.access_token);
      Logger.info('Spotify API initialized successfully');
    } catch (error) {
      Logger.error('Failed to initialize Spotify API:', error);
      throw error;
    }
  }

  async getCurrentPlayback() {
    try {
      const response = await this.api.getMyCurrentPlaybackState();
      return response.body;
    } catch (error) {
      Logger.error('Failed to get playback state:', error);
      return null;
    }
  }

  async transferPlayback(deviceId) {
    try {
      await this.api.transferMyPlayback([deviceId], { play: true });
      Logger.info('Playback transferred successfully');
    } catch (error) {
      Logger.error('Failed to transfer playback:', error);
      throw error;
    }
  }

  async startAutoplay() {
    try {
      await this._startRecommendedTracks();
    } catch (error) {
      Logger.warn('Failed to start recommended tracks, falling back to playlist:', error);
      await this._playFallbackPlaylist();
    }
  }

  async _startRecommendedTracks() {
    const recentTracks = await this.api.getMyRecentlyPlayedTracks({ limit: 5 });
    const seedTracks = recentTracks.body.items.map(item => item.track.id).slice(0, 3);

    const recommendations = await this.api.getRecommendations({
      seed_tracks: seedTracks,
      limit: this.config.autoplay.similarTracksCount
    });

    const trackUris = recommendations.body.tracks.map(track => track.uri);
    await this.api.play({ uris: trackUris });
    Logger.info('Started playing recommended tracks');
  }

  async _playFallbackPlaylist() {
    await this.api.play({
      context_uri: `spotify:playlist:${this.config.autoplay.fallbackPlaylist}`
    });
    Logger.info('Started playing fallback playlist');
  }
}