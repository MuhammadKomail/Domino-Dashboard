export interface Notification {
  notificationId: string;
  message: string;
  title: string;
  description: string;
  at: string; // ISO Date String
  sendToUserType: string;
  targetNamespace: string;
  tag: string;
  isOnClick: boolean;
  onClickDate: string;
  userId: string;
}

export interface NotificationResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: Notification[];
  exception: any[];
}

export interface UserNotificationResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: NotificationData;
  exception: any[];
}

export interface NotificationData {
  notifications: UserNotificationData[];
  totalCount: number;
}

export interface UserNotificationData {
  notificationId: string;
  message: string;
  title: string;
  description: string;
  at: Date;
  sendToUserType: string;
  targetNamespace: string;
  tag: string;
  userId: string;
  isSeen: boolean;
  onClickDate: string;
  senderUserId: string;
  topicName: string;
  senderUserType: string;
  recieverUserId: string;
  recieverUserType: string;
}
