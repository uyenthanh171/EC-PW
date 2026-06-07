import { STATUS_CODE } from '../../config/constant';
import { test, expect } from '../../fixtures/auth.fixtures';
import authData from '../../test-data/auth.data.json';

test.describe('AUTH - Get Current User API', () => {

    test('TC04-AUTH: Verify get current user with valid access token',
        async ({ validTokenService }) => {
            const response = await validTokenService.getCurrentUser();
            expect(response.status).toBe(STATUS_CODE.OK);
            expect(response.payload?.email).toBe(authData.AUTH_ME.VALID_USER.email);
            expect(response.payload?.phone).toBe(authData.AUTH_ME.VALID_USER.phone);
            expect(response.payload?.username).toBe(authData.CRE.VALID_CRE.username);
        });

    test('TC05-AUTH: Verify get current user without access token',
        async ({ unauthenticatedService }) => {
            const response = await unauthenticatedService.getCurrentUser();
            expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);
            expect(response.apiError?.message).toContain('Access Token is required');
        });

    test('TC06-AUTH: Verify get current user with invalid access token',
        async ({ invalidTokenService }) => {
            const response = await invalidTokenService.getCurrentUser();
            expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);
            expect(response.apiError?.message).toContain('Invalid/Expired Token!');
        });

    test('TC07-AUTH: Verify get current user with expired token',
        async ({ expiredTokenService }) => {
            const response = await expiredTokenService.getCurrentUser();
            expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);
            expect(response.apiError?.message).toContain('Token Expired');
        });
});