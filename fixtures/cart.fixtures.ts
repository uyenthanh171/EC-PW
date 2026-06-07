import { baseCustomFixture } from "./base.fixtures";
import { CartClient } from "../api/clients/cart.client";
import { CartService } from "../api/services/cart.service";
import { expect } from "@playwright/test";

type CartFixture = {
    cartService: CartService;
}

export const test = baseCustomFixture.extend<CartFixture>({

    cartService: async ({ apiContext }, use) => {
        await use(new CartService(new CartClient(apiContext)))
    }
})

export { expect }