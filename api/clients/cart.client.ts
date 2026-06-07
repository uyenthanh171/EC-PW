import { BaseAPI } from "./base.client";
import { BaseResponse } from "../../types/common";
import {
    Cart,
    CartList,
    AddCartRequest,
    UpdateCartRequest,
    DeleteCartResponse
} from "../../types/cart"

const CART_URL = {
    BASE: '/carts',
    USER: '/carts/user',
    ADD: '/carts/add',
} as const

export class CartClient extends BaseAPI {
    async getAllCarts(): Promise<BaseResponse<CartList>> {
        return this.get<CartList>(CART_URL.BASE);
    }

    async getACart(cartId: number): Promise<BaseResponse<Cart>> {
        return this.get<Cart>(`${CART_URL.BASE}/${cartId}`);
    }

    async getCartByUser(userId: number): Promise<BaseResponse<CartList>> {
        return this.get<CartList>(`${CART_URL.USER}/${userId}`);
    }

    async addACart(payload: AddCartRequest): Promise<BaseResponse<Cart>> {
        return this.post<Cart>(CART_URL.ADD, payload)
    }

    async updateACart(cartId: number, payload: UpdateCartRequest): Promise<BaseResponse<Cart>> {
        return this.put<Cart>(`${CART_URL.BASE}/${cartId}`, payload)
    }

    async patchACart(cartId: number, payload: UpdateCartRequest): Promise<BaseResponse<Cart>> {
        return this.patch<Cart>(`${CART_URL.BASE}/${cartId}`, payload)
    }

    async deleteACart(cartId: number): Promise<BaseResponse<DeleteCartResponse>> {
        return this.delete<DeleteCartResponse>(`${CART_URL.BASE}/${cartId}`)
    }
}