import { BaseAPI } from './base.client';
import { BaseResponse } from '../../types/common';
import {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    GetCurrentUserResponse,
} from '../../types/auth';

const AUTH_URLS = {
    LOGIN: '/auth/login',
    CURRENT_USER: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh',
} as const;

export class AuthClient extends BaseAPI {

    async login(payload: LoginRequest): Promise<BaseResponse<LoginResponse>> {
        return this.post<LoginResponse>(AUTH_URLS.LOGIN, payload);
    }

    async getCurrentUser(): Promise<BaseResponse<GetCurrentUserResponse>> {
        return this.get<GetCurrentUserResponse>(AUTH_URLS.CURRENT_USER);
    }

    async refreshToken(payload: RefreshTokenRequest): Promise<BaseResponse<RefreshTokenResponse>> {
        return this.post<RefreshTokenResponse>(AUTH_URLS.REFRESH_TOKEN, payload);
    }
}