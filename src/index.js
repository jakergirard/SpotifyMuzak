import dotenv from 'dotenv';
import { LibrespotPlayer } from './services/player.js';
import { SpotifyController } from './services/spotify-controller.js';
import { PlaybackMonitor } from './services/playback-monitor.js';
import { loadConfig } from './config.js';
import { Logger } from './utils/logger.js';

// Load environment variables
dotenv.config();

let monitor = null;
let player = null;

async function cleanup() {
  try {
    if (monitor) {
      monitor.stop();
    }
    if (player) {
      await player.cleanup();
    }
    Logger.info('Cleanup completed successfully');
  } catch (error) {
    Logger.error('Error during cleanup:', error);
  }
}

async function main() {
  try {
    // Load and validate configuration
    const config = await loadConfig();
    
    // Initialize services
    const spotifyController = new SpotifyController(config.spotify);
    player = new LibrespotPlayer(config);

    // Initialize core components
    await Promise.all([
      player.initialize(),
      spotifyController.initialize()
    ]);

    // Start playback monitoring
    monitor = new PlaybackMonitor(spotifyController, player);
    monitor.start();

    // Handle graceful shutdown
    process.on('SIGTERM', async () => {
      Logger.info('Received SIGTERM signal, initiating shutdown...');
      await cleanup();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      Logger.info('Received SIGINT signal, initiating shutdown...');
      await cleanup();
      process.exit(0);
    });

  } catch (error) {
    Logger.error('Fatal error:', error);
    await cleanup();
    process.exit(1);
  }
}

// Start the application
main().catch(async (error) => {
  Logger.error('Unhandled error in main:', error);
  await cleanup();
  process.exit(1);
});