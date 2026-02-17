// Represents the data needed for login
export interface LoginData {
  username: string;
  password: string;
}

// Represents the entire response from the login API
export interface LoginResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: UserDataResponse | null;
  exception: string[];
}

// Represents the user data contained within the `data` field of the `AuthResponse`
export interface UserDataResponse {
  // legacy fields (optional)
  name?: string;
  email?: string;
  userId?: string;
  userType?: string;
  refreshToken?: string;
  roleAndActions?: RoleAndAction[];

  // new backend fields
  success?: boolean;
  sessionId?: string;
  token?: string;
  message?: string;
  role?: string;
  allowed_tables?: string[];
  allowed_routes?: string[];
}

// Represents the role and actions assigned to the user
export interface RoleAndAction {
  userRoleAssignDate: string;
  actions: any[]; // Replace 'any' if actions have a specific structure.
  roleId: string;
  name: string;
  createdBy: string;
  updatedBy: string;
  updatedDate: string;
  createdDate: string;
  isActive: boolean;
}

export interface OtpHistoryResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: OtpHistoryData | null;
  exception: any[];
}

export interface OtpHistoryData {
  history: OtpHistoryItem[];
  otpId: string;
  userId: string;
  isVerified: boolean;
  otpCode: string;
  email: string;
  expiredTime: string; // ISO Date String
  newTokenGenerateTime: string; // ISO Date String
}

export interface OtpHistoryItem {
  description: string;
  deviceId: string;
  updatedBy: string;
  updatedDate: string; // ISO Date String
}

// Note: Refresh Token Types

export interface RefreshTokenResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: RefreshTokenData;
  exception: any[];
}

export interface RefreshTokenData {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenPayload {
  accessToken: string;
  refreshToken: string;
}
