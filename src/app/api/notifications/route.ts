import { NextResponse } from 'next/server';
import { HttpError } from '@/shared/server/http-errors';
import { notificationsService } from '@/features/Notifications/server/notifications.service';
import { connectDb } from '@/shared/server/connect-db';
import { getAuthenticatedUserId } from '@/shared/server/get-user-id';

export async function GET(request: Request) {
  try {
    await connectDb();
    const userId = getAuthenticatedUserId(request);
    const notifications = await notificationsService.listNotifications(userId);

    return NextResponse.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error ? error.message : 'Failed to fetch notifications';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
