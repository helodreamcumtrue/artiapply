import { NextResponse } from 'next/server';
import { getEmailQueue, getRedisConnection } from '@/lib/queue/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const redis = getRedisConnection();
    const ping = await redis.ping().catch(() => null);

    if (!ping) {
      return NextResponse.json({
        connected: false,
        status: 'disconnected',
        message: 'Redis is not connected. BullMQ queue is in offline/simulation mode.',
        counts: { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
      });
    }

    const queue = getEmailQueue();
    const counts = await queue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed');

    return NextResponse.json({
      connected: true,
      status: 'active',
      queueName: queue.name,
      rateLimit: '2 emails / second',
      counts,
    });
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      status: 'error',
      error: error?.message || 'Failed to inspect queue',
      counts: { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
    });
  }
}
