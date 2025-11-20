export interface Data<T> {
    code?: number;
    result?: {
        data?: T[]
    };
}

export interface ColumnConfig {
  key: string;
  label: string;
  width: number;
}