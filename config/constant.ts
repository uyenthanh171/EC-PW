export const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;

export const CONFIG = {
    BASE_URL: process.env.BASE_URL ?? 'https://dummyjson.com',
} as const;