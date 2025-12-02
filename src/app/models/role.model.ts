import { NoAction } from './base.model';

export interface ListRole {
  name?: string | null;
  action?: string | null;
  page?: number | null;
  size?: number | null;
  sortBy?: string | null;
  sortType?: string | null;
  permissions?: string;
  ids?: string | null;
}

export interface RoleEditCreate {
  name: string;
  description: string | null;
  action: number;
}

export interface Role {
  index?: number;
  id: number;
  name: string;
  description?: string | null;
  action: number | string;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  permissions?: NoAction[];
  edit?: boolean;
}
