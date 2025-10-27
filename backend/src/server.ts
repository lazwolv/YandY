import app from './app';
import { config } from './config/env';
import { prisma } from './config/database';
import redis from './config/redis';

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Test Redis connection
    await redis.ping();
    console.log('✅ Redis connected successfully');

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
