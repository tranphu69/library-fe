export interface ListPermission {
    name?: string | null;
    action?: string | null;
    page?: number | null;
    size?: number | null;
    sortBy?: string | null;
    sortType?: string | null;
}

export interface Permission {
    index?: number;
    id: number;
    name: string;
    description?: string | null;
    action: number;
    createdAt?: string | null;
    updatedAt?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
}