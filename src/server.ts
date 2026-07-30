import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { smtpProvider } from './providers/smtp.provider.js';

const server = app.listen(env.PORT, () => {
  logger.info(
    `🚀 Server listening on port ${env.PORT} in ${env.NODE_ENV} mode`,
  );
  
  
  // Verify SMTP connection on startup asynchronously
  smtpProvider.verifyConnection();
});

// Graceful Shutdown Handler
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Initiating graceful shutdown...`);

  server.close(() => {
    logger.info('HTTP server closed.');

    try {
      smtpProvider.close();
    } catch (err) {
      logger.error({ err }, 'Error closing SMTP connection');
    }

    logger.info('Process exit completed.');
    process.exit(0);
  });

  // Force shutdown after 10 seconds timeout
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
