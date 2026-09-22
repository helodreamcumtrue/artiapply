/**
 * ArticleApply Standalone BullMQ Worker Process
 * Run using: npm run worker
 */
import { initWorker } from '../src/lib/queue/worker';
import { getRedisConnection } from '../src/lib/queue/client';

console.log('====================================================');
console.log('🚀 Starting ArticleApply Cold Email Worker Process');
console.log('====================================================');

const redis = getRedisConnection();

redis.ping()
  .then((res) => {
    console.log(`[Worker Process] Redis connection verified: ${res}`);
    const worker = initWorker();
    console.log(`[Worker Process] BullMQ Worker listening on queue: email-queue`);
    console.log(`[Worker Process] Rate limit: 2 emails / second`);
  })
  .catch((err) => {
    console.error('[Worker Process] Failed to connect to Redis. Ensure Redis is running (e.g. docker-compose up -d):', err.message);
  });

// Handle graceful shutdown
const shutdown = async (signal: string) => {
  console.log(`\n[Worker Process] Received ${signal}. Shutting down gracefully...`);
  try {
    const worker = initWorker();
    await worker.close();
    await redis.quit();
    console.log('[Worker Process] Worker and Redis connections closed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('[Worker Process] Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
