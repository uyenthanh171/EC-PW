import { AuthClient } from '../clients/auth.client';
import { BaseResponse } from '../../types/common';
import {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    GetCurrentUserResponse
} from '../../types/auth';

export class AuthService {
    constructor(private client: AuthClient) { }

    async login(payload: LoginRequest): Promise<BaseResponse<LoginResponse>> {
        return this.client.login(payload);
    }

    async getCurrentUser(): Promise<BaseResponse<GetCurrentUserResponse>> {
        return this.client.getCurrentUser();
    }

    async refreshToken(payload: RefreshTokenRequest): Promise<BaseResponse<RefreshTokenResponse>> {
        return this.client.refreshToken(payload);
    }
}