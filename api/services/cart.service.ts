import { CartClient } from "../clients/cart.client";
import { BaseResponse } from "../../types/common";
import {
    CartList,
    Cart,
    AddCartRequest,
    UpdateCartRequest,
    DeleteCartResponse
} from "../../types/cart"

export class CartService {
    constructor(private client: CartClient) { }

    async getAllCarts(): Promise<BaseResponse<CartList>> {
        return this.client.getAllCarts();
    }

    async getACart(cartId: number): Promise<BaseResponse<Cart>>{
        return this.client.getACart(cartId);
    }

    async getCartByUser(userId: number): Promise<BaseResponse<CartList>>{
        return this.client.getCartByUser(userId);
    }

    async addACart(payload: AddCartRequest): Promise<BaseResponse<Cart>>{
        return this.client.addACart(payload);
    }
    
    async updateACart(cartId: number, payload: UpdateCartRequest): Promise<BaseResponse<Cart>>{
        return this.client.updateACart(cartId, payload);
    }

    async patchACart(cartId: number, payload: UpdateCartRequest): Promise<BaseResponse<Cart>> {
        return this.client.patchACart(cartId, payload);
    }
    async deleteACart(cartId: number): Promise<BaseResponse<DeleteCartResponse>>{
        return this.client.deleteACart(cartId);
    }
}