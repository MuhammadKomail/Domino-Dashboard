// Note: Response structure for total user count API...!
export interface TotalUserCountResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: number | null; // Total count will be a number
  exception: string[];
}

// Note: Response structure for user list...!
export interface ListAllUsersResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: User[]; // Array of User objects
  exception: string[];
}

// Note: Response structure of adding user...!
export interface AddUserResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: boolean;
  exception: string[];
}

export interface User {
  userId: string;
  name: string;
  email: string;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
  isActive: boolean;
}

export interface AddUserRequest {
  email: string;
  name: string;
  password: string;
  confirmedPassword: string;
  isRefreshTokenRevokable: boolean;
  expiryDate: string; // ISO 8601 format
  roleIds: string[]; // Array of role IDs
  userType: string;
}
