import app from './app';
import { config } from './config/env';
import { prisma } from './config/database';
import redis from './config/redis';

// Retry connection with exponential backoff
const retryConnection = async (
  fn: () => Promise<void>,
  name: string,
  maxRetries = 10,
  baseDelay = 1000
): Promise<void> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await fn();
      console.log(`✅ ${name} connected successfully`);
      return;
    } catch (error) {
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), 30000);
      console.log(
        `⚠️  ${name} connection attempt ${attempt}/${maxRetries} failed. Retrying in ${delay}ms...`
      );
      if (attempt === maxRetries) {
        throw new Error(`Failed to connect to ${name} after ${maxRetries} attempts`);
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

const startServer = async () => {
  try {
    // Test database connection with retries
    await retryConnection(
      async () => await prisma.$connect(),
      'Database'
    );

    // Test Redis connection with retries
    await retryConnection(
      async () => {
        const result = await redis.ping();
        if (result !== 'PONG') throw new Error('Redis ping failed');
      },
      'Redis'
    );

    // Start server
    const server = app.listen(config.PORT, () => {
      console.log(`🚀 Server running on port ${config.PORT}`);
      console.log(`📝 Environment: ${config.NODE_ENV}`);
      console.log(`🔗 API: http://localhost:${config.PORT}/api`);
      console.log(`❤️  Health: http://localhost:${config.PORT}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
      console.log('\n🛑 Shutting down gracefully...');

      server.close(async () => {
        console.log('✅ HTTP server closed');

        await prisma.$disconnect();
        console.log('✅ Database disconnected');

        await redis.quit();
        console.log('✅ Redis disconnected');

        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('⚠️  Forced shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
