export function validateSpotifyConfig(config) {
  const required = ['username', 'password', 'clientId', 'clientSecret', 'deviceName'];
  for (const field of required) {
    if (!config.spotify[field]) {
      throw new Error(`Missing required Spotify configuration: ${field}`);
    }
  }
}

export function validateAudioConfig(config) {
  const required = ['device', 'format', 'rate'];
  for (const field of required) {
    if (!config.audio[field]) {
      throw new Error(`Missing required audio configuration: ${field}`);
    }
  }

  // Validate volume configuration
  if (!config.audio.volume) {
    throw new Error('Missing volume configuration in audio settings');
  }

  const { volume } = config.audio;
  if (typeof volume.initial !== 'number' || volume.initial < 0 || volume.initial > 100) {
    throw new Error('Invalid initial volume: must be a number between 0 and 100');
  }

  if (typeof volume.max !== 'number' || volume.max < 0 || volume.max > 100) {
    throw new Error('Invalid max volume: must be a number between 0 and 100');
  }

  if (volume.initial > volume.max) {
    throw new Error('Initial volume cannot be greater than max volume');
  }
}