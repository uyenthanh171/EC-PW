import { test as base, request, APIRequestContext } from '@playwright/test';
import { CONFIG } from '../config/constant';

type BaseFixtures = {
    apiContext: APIRequestContext;
    createApiContext: (headers?: Record<string, string>) => Promise<APIRequestContext>;
};

export const baseCustomFixture = base.extend<BaseFixtures>({

    // Unauthenticated context — dành cho các fixture không cần dùng token
    apiContext: async ({ }, use) => {
        const context = await request.newContext({
            baseURL: CONFIG.BASE_URL,
            extraHTTPHeaders: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
        await use(context);
        await context.dispose();
    },

    // Factory — dành cho các fixture cần tạo context có thêm các header tùy chỉnh (như Token)
    createApiContext: async ({ }, use) => {
        const contexts: APIRequestContext[] = [];

        const factory = async (
            headers: Record<string, string> = {}
        ): Promise<APIRequestContext> => {
            const context = await request.newContext({
                baseURL: CONFIG.BASE_URL,
                extraHTTPHeaders: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...headers,     // Gộp các header do phía gọi truyền vào lên trên cấu hình gốc
                },
            });
            contexts.push(context);
            return context;
        };

        await use(factory);

        // Tự động dọn dẹp (Dispose) TẤT CẢ các context được tạo ra từ factory này sau khi test chạy xong
        for (const context of contexts) {
            await context.dispose();
        }
    },
});