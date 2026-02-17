// Note: Get Sidebar Chat List
export interface TotalLastChatSideCountResponse {
    isApiHandled: boolean;
    isRequestSuccess: boolean;
    statusCode: number;
    message: string;
    data: LastChatSideData[];
    exception: any[];
}

export interface LastChatSideData {
    chatId: string;
    chats: LastChatSideChat[];
    messages: LastChatSideMessage[];
}

export interface LastChatSideChat {
    id: string;
    name: string;
    description: string;
    dpUrl: string;
    expiryMins: number | null;
    createdBy: string;
    updatedBy: string;
    createdDate: Date;
    updatedDate: Date;
    isActive: boolean;
    isArchived: boolean;
}

export interface LastChatSideMessage {
    id: null | string;
    name: null | string;
    data: null | string;
    isRead: boolean | null;
    createdBy: null | string;
    updatedBy: null | string;
    createdDate: Date;
    updatedDate: Date;
    isActive: boolean;
    isArchived: boolean;
}

// Note: Get User Chat
export interface TotalUserChatCountResponse {
    isApiHandled: boolean;
    isRequestSuccess: boolean;
    statusCode: number;
    message: string;
    data: UserChatData[];
    exception: any[];
}

export interface UserChatData {
    id: string;
    name: string;
    data: string;
    isRead: boolean;
    userId: string;
    userDetails: UserChatUserDetails;
    createdBy: string;
    updatedBy: string;
    createdDate: Date;
    updatedDate: Date;
    isActive: boolean;
    isArchived: boolean;
    dpUrl: string;
}

export interface UserChatUserDetails {
    id: string;
    name: string;
    email: string;
    userType: string;
}

// Note: Chat Massage Send
export interface SendMessage {
    targetNamespace: string;
    tag: string;
    chatId: string;
    userId: string;
    messageName: string;
    messageData: string;
    messageIsRead: boolean;
    isActive: boolean;
}

// Note: Create New Chat Types
export interface TotalCreateNewChatResponse {
    isApiHandled: boolean;
    isRequestSuccess: boolean;
    statusCode: number;
    message: string;
    data: string;
    exception: any[];
}

export interface CreateNewChat {
    chatName: string;
    chatDescription: string;
    chatDpUrl: string;
    expiryMins: number;
    userIds: string[];
}
