# Folder Structure

```txt
project/
    api/
        clients/
            base.client.js
            auth.client.js
        endpoints/
            auth.endpoints.ts
        services/
            auth.service.js
        config/
            constant.ts
        fixtures/
            auth.fixtures.ts
            base.fixtures.ts
        tests
            auth-login.spec.ts
```

# base.client.js

import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseResponse } from '../../types/common';

export class BaseAPI {
    constructor(protected request: APIRequestContext) { }

    /**
     * Phương thức lõi để thực thi request và xử lý lỗi tập trung
     */
    private async execute<T>(
        method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        url: string,
        options: any = {}
    ): Promise<BaseResponse<T>> {

        // 1. Thêm Default Headers (Ví dụ: Auth Token)
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        };

        try {
            const response: APIResponse = await this.request[method.toLowerCase()](url, {
                ...options,
                headers,

            });

            // 2. Parse Response
            const status = response.status();
            const ok = response.ok();
            let payload: any;

            const contentType = response.headers()['content-type'];
            if (contentType?.includes('application/json')) {
                payload = await response.json();
            } else {
                payload = await response.text();
            }

            // 3. Centralized Error Logging
            if (!ok) {
                console.error(`❌ API Error: [${method}] ${url} | Status: ${status}`);
                console.error(`Response Body:`, payload);
                return { status, headers: response.headers(), apiError: payload }
            }
            else {
                return { status, payload, headers: response.headers()};
            }

        } catch (error) {
            console.error(`🚨 Network/Request Error: [${method}] ${url}`, error);
            throw error;
        }
    }

    // --- Public Methods ---
    async get<T>(url: string, params?: object) {
        return this.execute<T>('GET', url, { params });
    }

    async post<T>(url: string, data?: object) {
        return this.execute<T>('POST', url, { data });
    }

    async put<T>(url: string, data?: object) {
        return this.execute<T>('PUT', url, { data });
    }

    async delete<T>(url: string) {
        return this.execute<T>('DELETE', url);
    }
}

# auth.client.js

import { GetCurrentUserResponse, LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse } from "../../types/auth";
import { BaseResponse } from "../../types/common";
import { AUTH_ENDPOINTS } from "../endpoints/auth.endpoint";
import { BaseAPI } from "./base.client";

export class AuthClient extends BaseAPI {
    async login(loginReq: LoginRequest): Promise<BaseResponse<LoginResponse>> {
        const res = await this.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, loginReq);
        return res;
    }

    async getCurrentUser(): Promise<BaseResponse<GetCurrentUserResponse>> {
        return this.get(AUTH_ENDPOINTS.GETCURRENTUSER);
    }

    async refreshToken(refreshReq: RefreshTokenRequest): Promise<BaseResponse<RefreshTokenResponse>> {
        return this.post<RefreshTokenResponse>(AUTH_ENDPOINTS.REFRESH_TOKEN, refreshReq);
    }

}

# auth.endpoints.js
    export const AUTH_ENDPOINTS = {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        GETCURRENTUSER: '/auth/me',
        REFRESH_TOKEN: '/auth/refresh'
}

# auth.service.js

import { APIRequestContext } from '@playwright/test';
import { GetCurrentUserResponse, LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse } from '../../types/auth';
import { AuthClient } from '../clients/auth.client';
import { BaseResponse } from '../../types/common';

export class AuthService {
    private client: AuthClient;
    constructor(context: APIRequestContext) {
        this.client = new AuthClient(context);
    }
    // Function to call login endpoint and return response body
    async login(payload: LoginRequest): Promise<BaseResponse<LoginResponse>> {
        const res = await this.client.login(payload);
        return res;
    }

    async getCurrentUser(): Promise<BaseResponse<GetCurrentUserResponse>> {
        const res = await this.client.getCurrentUser();
        return res;
    }

    async refreshToken(payload: RefreshTokenRequest): Promise<BaseResponse<RefreshTokenResponse>> {
        const res = await this.client.refreshToken(payload);
        return res;
    }
}

# auth.fixtures.ts

import { request } from '@playwright/test';
import { AuthService } from '../api/services/auth.service';
import { baseCustomFixture } from '../fixtures/base.fixtures';
type ApiFixtures = {
    authServiceWithoutToken: AuthService,
    authServiceWithValidToken: AuthService,
    authServiceWithInvalidToken: AuthService
    authServiceWithExpiredToken: AuthService
};

export const test = baseCustomFixture.extend<ApiFixtures>({ 
    authServiceWithoutToken: async ({ request }, use) => { //Xử lí authService với request mặc định
        const authService = new AuthService(request);
        await use(authService);
    },
    authServiceWithValidToken: async ({baseReqValidToken}, use) => { 
        const authService = new AuthService(baseReqValidToken); //Xử lí authService với request custom (nằm ở base.fixture.ts)
        await use(authService)
    },
    authServiceWithInvalidToken: async ({ baseReqInvalidToken }, use) => {
        const authService = new AuthService(baseReqInvalidToken) //Tương tự như authServiceWithValidToken
        await use(authService)
    },
    authServiceWithExpiredToken: async ({baseReqExpiredToken} , use) => {
        const authService = new AuthService(baseReqExpiredToken) //Tương tự như authServiceWithValidToken
        await use(authService) 
    }
});

export { expect } from '@playwright/test';

# base.fixtures.ts

import { request, test as base, APIRequestContext } from '@playwright/test';
import data from '../test-data/auth.data.json'
import { AUTH_ENDPOINTS } from '../api/endpoints/auth.endpoint';

type ApiFixtures = {
    baseReqValidToken: APIRequestContext,
    baseReqInvalidToken: APIRequestContext,
    baseReqExpiredToken: APIRequestContext,
    baseReqRefreshToken: string
}

export const baseCustomFixture = base.extend<ApiFixtures>({
    baseReqValidToken: async ({ }, use) => {
        const context = await request.newContext();

        const response = await context.post(AUTH_ENDPOINTS.LOGIN, {
            data: data.CRE.VALID_CRE
        });

        const body = await response.json();
        const token = body.accessToken;
        const contextN = await request.newContext({
            extraHTTPHeaders: {
                Authorization: `Bearer ${token}`
            },

        });

        await use(contextN);
    },
    baseReqInvalidToken: async ({ }, use) => {
        const contextN = await request.newContext({
            extraHTTPHeaders: {
                Authorization: `Bearer ${data.TOKEN.INVALID_ACESSTOKEN}`
            },

        });

        await use(contextN);
    },
    baseReqExpiredToken: async ({ }, use) => {
        const contextN = await request.newContext({
            extraHTTPHeaders: {
                Authorization: `Bearer ${data.TOKEN.EXPIRED_ACCESSTOKEN}`
            },
        });

        await use(contextN)
    },

    baseReqRefreshToken: async ({ request }, use) => {
        const res = await request.post( AUTH_ENDPOINTS.LOGIN, {
            data: {
                username: data.CRE.VALID_CRE.username,
                password: data.CRE.VALID_CRE.password,
            },
        });

        const body = await res.json();

        const refreshToken = body.refreshToken;

        await use(refreshToken); //Share for all testcases
    }
});

export { expect } from '@playwright/test';

# auth-login.spec.ts

import { STATUS_CODE } from '../../config/constant';
import { test, expect } from '../../fixtures/auth.fixtures';
import authData from '../../test-data/auth.data.json';

test.describe('AUTH - Login API', () => {

    test('TC01-AUTH: Verify login successfully', async ({ authServiceWithoutToken }) => {
        const response = await authServiceWithoutToken.login(authData.CRE.VALID_CRE)
        expect(response.status).toBe(STATUS_CODE.OK);
        expect(response.payload).toHaveProperty('id');
        expect(response.payload).toHaveProperty('username', authData.CRE.VALID_CRE.username);
        expect(response.payload).toHaveProperty('accessToken');
    });

    test('TC02-AUTH: Verify login with invalid credentials', async ({ authServiceWithoutToken }) => {
        const response = await authServiceWithoutToken.login(authData.CRE.INVALID_CRE)
        expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);
        expect(response.apiError?.message).toContain('Invalid credentials')

    });
    test('TC03-AUTH: Verify login with empty credential field', async ({ authServiceWithoutToken }) => {
        const response = await authServiceWithoutToken.login(authData.CRE.EMPTY_CRE)
        expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);
        expect(response.apiError?.message).toContain('Username and password required')
    })
});