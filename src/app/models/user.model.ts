import { Position } from "../enums/position";
import { Gender } from "../enums/gender";
import { AccountStatus } from "../enums/accountStatus";
import { NoAction } from "./base.model";

export interface ListUser {
    username?: string | null;
    email?: string | null;
    fullName?: string | null;
    code?: string | null;
    phone?: string | null;
    major?: string | null;
    course?: string | null;
    position?: Position | null;
    gender?: Gender | null;
    dob?: string | null;
    status?: AccountStatus | null;
    roles?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    sortType?: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    fullName?: string;
    code?: string;
    phone?: string;
    avatarUrl?: string;
    major?: string;
    course?: string;
    position?: Position;
    gender?: Gender;
    dob?: string;
    status?: AccountStatus;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    lastLoginAt?: string;
    failedLoginAttempts?: number;
    lockedUntil?: string;
    twoFactorEnabled?: boolean;
    roles: NoAction[];
}