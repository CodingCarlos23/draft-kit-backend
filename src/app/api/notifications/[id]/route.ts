import { NextResponse } from 'next/server';
import { HttpError } from '@/shared/server/http-errors';
import { notificationsService } from '@/features/Notifications/server/notifications.service';
import { connectDb } from '@/shared/server/connect-db';
import { getAuthenticatedUserId } from '@/shared/server/get-user-id';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(request: Request, context: RouteContext) {
  try {
    await connectDb();
    const userId = getAuthenticatedUserId(request);
    const { id } = await context.params;
    const notification = await notificationsService.deleteNotification(
      id,
      userId,
    );

    if (!notification) {
      return NextResponse.json(
        { success: false, message: 'Notification not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status },
      );
    }

    const message =
      error instanceof Error ? error.message : 'Failed to delete notification';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
