import { STATUS_CODE } from '../../config/constant';
import { test, expect } from '../../fixtures/auth.fixtures';

test.describe('AUTH - Refresh Auth Session API', () => {

    test('TC08-AUTH: Verify refresh token with valid refresh token',
        async ({ validTokenService, refreshToken }) => {
            const response = await validTokenService.refreshToken({
                refreshToken,
                expiresInMins: 30,
            });
            expect(response.status).toBe(STATUS_CODE.OK);
        });
});