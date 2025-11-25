export interface Data<T> {
  code?: number;
  result?: {
    data?: T[];
    currentPage?: number;
    currentSize?: number;
    totalElements?: number;
    totalPages?: number;
  };
}

export interface DataDetail<T> {
  code?: number;
  result?: T;
}

export interface ColumnConfig {
  key: string;
  label: string;
  width: number;
  sortable?: boolean;
}

export interface NoAction {
  id: number;
  name: string;
  description: string;
}
