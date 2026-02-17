// Note: Response structure for role list...!
export interface ListAllRolesResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: Role[];
  exception: string[];
}

export interface ListAllRoleWithActionResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: RoleWithAction[];
  exception: string[];
}

export interface AddRoleResponse {
  isApiHandled: boolean;
  isRequestSuccess: boolean;
  statusCode: number;
  message: string;
  data: boolean;
  exception: string[] | Record<string, string[]>;
}

export interface Role {
  id: string;
  name: string;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
  isActive: boolean;
}

export interface RoleWithAction {
  roleId: string;
  roleName: string;
  actions: ActionInsideRole[];
}

export interface ActionInsideRole {
  actionId: string;
  actionName: string;
  isAssigned: boolean
}
