import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { EmailJobData } from '@/types/database';

export const QUEUE_NAME = 'email-queue';

let redisConnection: IORedis | null = null;
let emailQueue: Queue<EmailJobData> | null = null;

export function getRedisConnection(): IORedis {
  if (!redisConnection) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    let hasWarned = false;
    redisConnection = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
      retryStrategy(times) {
        if (times > 3) {
          return null; // Stop retrying if Redis is offline
        }
        return Math.min(times * 200, 1000);
      },
    });

    redisConnection.on('error', (err) => {
      if (!hasWarned) {
        hasWarned = true;
        console.warn('[Redis] Connection warning (Redis offline, fallback mode active):', err.message);
      }
    });
  }
  return redisConnection;
}

export function getEmailQueue(): Queue<EmailJobData> {
  if (!emailQueue) {
    const connection = getRedisConnection();
    emailQueue = new Queue<EmailJobData>(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: {
          age: 3600, // Keep completed jobs for 1 hour
          count: 1000,
        },
        removeOnFail: {
          age: 86400, // Keep failed jobs for 24 hours
        },
      },
    });
  }
  return emailQueue;
}

/**
 * Enqueue a list of contact email jobs for a campaign
 */
export async function enqueueEmailJobs(jobs: EmailJobData[]): Promise<boolean> {
  try {
    const queue = getEmailQueue();
    const formattedJobs = jobs.map((job) => ({
      name: `send-email-${job.contactId}`,
      data: job,
      opts: {
        jobId: `job-${job.contactId}`,
      },
    }));

    await queue.addBulk(formattedJobs);
    console.log(`[Queue] Successfully enqueued ${jobs.length} email jobs.`);
    return true;
  } catch (error) {
    console.error('[Queue] Failed to enqueue email jobs:', error);
    return false;
  }
}
