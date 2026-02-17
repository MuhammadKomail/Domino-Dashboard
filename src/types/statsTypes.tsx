export interface UserStatsProps {
  totalUsers?: number;
  activeUsers: number;
  newUsers: number;
  newUsersPercentage: number;
  onAddUser: () => void;
  canAddUser: boolean
}

export interface RoleStatsProps {
  totalRoles?: number;
  totalAssigned?: number;
  totalUnAssigned?: number;
  totalUnAssignedPercentage?: number;
  onRoleManager: () => void;
  canAddRole: boolean
}

export interface ActionStatsProps {
  totalActions?: number;
  totalAssigned?: number;
  totalUnAssigned?: number;
  totalUnAssignedPercentage?: number;
  onAddAction: () => void;
}

export interface TotpStatsProps {
  totalAccounts?: number;
  uniqueUsers?: number;
  newUsers?: number;
  uniqueApps?: number;
}
