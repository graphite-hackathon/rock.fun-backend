import { connectDB, disconnectDB } from '@config/mongoose';
import http from 'http';
import { config } from '@config/index';
import app from './app';

const port = config.port;
const server = http.createServer(app);

const startServer = async () => {
  try {
    // Connect to MongoDB *before* starting the server and scheduler
    await connectDB();
    

    server.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
      console.log('Starting scheduler...');

    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
    console.log(`${signal} signal received: closing HTTP server`);

    server.close(async () => {
        console.log('HTTP server closed');
        await disconnectDB(); // Disconnect MongoDB
        console.log('Exiting process.');
        process.exit(0);
    });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT')); // Handle Ctrl+C

// Start the server
startServer();