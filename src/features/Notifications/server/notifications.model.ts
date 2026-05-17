import mongoose, { Schema } from 'mongoose';
import type { Notification } from '../types/notifications.types';

type NotificationDocument = Omit<Notification, 'userId'> & {
  userId: mongoose.Types.ObjectId | string;
};

const notificationSchema = new Schema<NotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.index({ userId: 1, timestamp: -1, createdAt: -1 });

export const NotificationModel: mongoose.Model<NotificationDocument> =
  mongoose.models.Notification ||
  mongoose.model<NotificationDocument>('Notification', notificationSchema);
