export type ID = string | number;

export type BaseResponse<T> = {
    status: number;
    payload?: T;
    headers?: any;
    message?: string;
    apiError?: ApiError
};

export type Pagination = {
    page: number;
    limit: number;
    total: number;
};

export type PaginatedResponse<T> = {
    data: T[];
    pagination: Pagination;
};

export type ApiError = {
    message: string;
    code?: string;
    status?: number;
};