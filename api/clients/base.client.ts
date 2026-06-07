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
                return { status, payload, headers: response.headers() };
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

    async patch<T>(url: string, data?: object) {
        return this.execute<T>('PATCH', url, { data });
    }

    async delete<T>(url: string) {
        return this.execute<T>('DELETE', url);
    }
}