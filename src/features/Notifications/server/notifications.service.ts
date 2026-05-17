import { isValidObjectId } from 'mongoose';
import { SYSTEM_USER_EXTERNAL_ID } from '@/features/Users/server/users.service';
import { UserModel } from '@/features/Users/server/users.model';
import { ForbiddenError } from '@/shared/server/http-errors';
import { NotificationModel } from './notifications.model';
import type {
  CreateArchivedNotificationInput,
  Notification,
} from '../types/notifications.types';

export class NotificationsService {
  async listNotifications(userId: string): Promise<Notification[]> {
    return (await NotificationModel.find({ userId })
      .sort({ timestamp: -1, createdAt: -1 })
      .lean()) as unknown as Notification[];
  }

  async archiveNotificationForAllUsers(
    input: CreateArchivedNotificationInput,
  ): Promise<number> {
    const users = await UserModel.find(
      { externalId: { $ne: SYSTEM_USER_EXTERNAL_ID } },
      { _id: 1 },
    ).lean();

    if (users.length === 0) {
      return 0;
    }

    const timestamp = input.timestamp ?? new Date().toISOString();

    await NotificationModel.insertMany(
      users.map((user) => ({
        userId: user._id,
        type: input.type,
        message: input.message,
        data: input.data ?? {},
        timestamp,
      })),
    );

    return users.length;
  }

  async deleteNotification(
    id: string,
    userId: string,
  ): Promise<Notification | null> {
    if (!isValidObjectId(id)) {
      return null;
    }

    const notification = (await NotificationModel.findOneAndDelete({
      _id: id,
      userId,
    }).lean()) as unknown as Notification | null;

    if (notification) {
      return notification;
    }

    const existingNotification = await NotificationModel.exists({ _id: id });

    if (existingNotification) {
      throw new ForbiddenError('Notification does not belong to user');
    }

    return null;
  }
}

export const notificationsService = new NotificationsService();
