// Note; User interface...!
export interface User {
  name: string;
  userId: string;
  email: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
}

export interface UsersTableProps {
  data: User[] | null;
  tableType: string | null;
  onRowClick: (user: User) => void;
}

//Note: Roles interface...!
export interface Role {
  id: string;
  name: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
}

export interface RolesTableProps {
  data: Role[] | null;
  tableType: string | null;
  onRowClick: (role: Role) => void;
}

export interface Action {
  id: string;
  name: string;
  tags: string;
}

export interface ActionTableProps {
  data: Action[] | null;
  tableType: string | null;
}
