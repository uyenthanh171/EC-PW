// auth.spec.ts
import { STATUS_CODE } from '../../config/constant';
import { test, expect } from '../../fixtures/auth.fixtures';
import authData from '../../test-data/auth.data.json';

test.describe('AUTH - Login API', () => {

    test('TC01-AUTH: Verify login successfully',
        async ({ unauthenticatedService }) => {
            const response = await unauthenticatedService.login(authData.CRE.VALID_CRE);
            expect(response.status).toBe(STATUS_CODE.OK);
            expect(response.payload).toHaveProperty('id');
            expect(response.payload).toHaveProperty('username', authData.CRE.VALID_CRE.username);
            expect(response.payload).toHaveProperty('accessToken');
        });

    test('TC02-AUTH: Verify login with invalid credentials',
        async ({ unauthenticatedService }) => {
            const response = await unauthenticatedService.login(authData.CRE.INVALID_CRE);
            expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);
            expect(response.apiError?.message).toContain('Invalid credentials');
        });

    test('TC03-AUTH: Verify login with empty credential fields',
        async ({ unauthenticatedService }) => {
            const response = await unauthenticatedService.login(authData.CRE.EMPTY_CRE);
            expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);
            expect(response.apiError?.message).toContain('Username and password required');
        });
});