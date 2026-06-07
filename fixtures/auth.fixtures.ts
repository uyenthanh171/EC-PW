import { baseCustomFixture } from '../fixtures/base.fixtures';
import { AuthClient } from '../api/clients/auth.client';
import { AuthService } from '../api/services/auth.service';
import { expect } from '@playwright/test';
import authData from '../test-data/auth.data.json';

type AuthFixtures = {
    unauthenticatedService: AuthService;
    validTokenService: AuthService;
    invalidTokenService: AuthService;
    expiredTokenService: AuthService;
    refreshToken: string;
};

export const test = baseCustomFixture.extend<AuthFixtures>({

    // Không inject token — dùng cho các bài test login và các case edge-case 401
    unauthenticatedService: async ({ apiContext }, use) => {
        await use(new AuthService(new AuthClient(apiContext)));
    },

    // Thực hiện login thật để lấy access token hợp lệ
    validTokenService: async ({ apiContext, createApiContext }, use) => {
        const loginRes = await new AuthService(new AuthClient(apiContext))
            .login(authData.CRE.VALID_CRE);
        const accessToken = loginRes.payload?.accessToken ?? '';
        const authedContext = await createApiContext({
            Authorization: `Bearer ${accessToken}`,
        });
        await use(new AuthService(new AuthClient(authedContext)));
    },

    // Inject một static token không hợp lệ — không cần gọi qua mạng
    invalidTokenService: async ({ createApiContext }, use) => {
        const authedContext = await createApiContext({
            Authorization: `Bearer ${authData.TOKEN.INVALID_ACCESSTOKEN}`,
        });
        await use(new AuthService(new AuthClient(authedContext)));
    },

    // Inject một static token đã hết hạn — không cần gọi qua mạng
    expiredTokenService: async ({ createApiContext }, use) => {
        const authedContext = await createApiContext({
            Authorization: `Bearer ${authData.TOKEN.EXPIRED_ACCESSTOKEN}`,
        });
        await use(new AuthService(new AuthClient(authedContext)));
    },

    // Trích xuất refresh token từ response login
    refreshToken: async ({ apiContext }, use) => {
        const loginRes = await new AuthService(new AuthClient(apiContext))
            .login(authData.CRE.VALID_CRE);
        await use(loginRes.payload?.refreshToken ?? '');
    },
});

export { expect };