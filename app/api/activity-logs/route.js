import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const logs = await ActivityLog.find({})
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({
      logs: logs.map(log => ({
        id: log._id,
        user: log.userEmail || 'System',
        action: log.action,
        type: log.type,
        details: log.details,
        ip: log.ip || '127.0.0.1',
        createdAt: log.createdAt,
      })),
    });
  } catch (error) {
    console.error('Activity logs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}