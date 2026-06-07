import { STATUS_CODE } from "../../config/constant";
import { test, expect } from "../../fixtures/cart.fixtures";
import cartData from "../../test-data/cart.data.json";

test.describe('CART - Read Operation', () => {

    test('TC01-CART: Verify can get all carts successfully',
        async ({ cartService }) => {
            const response = await cartService.getAllCarts();
            expect(response.status).toBe(STATUS_CODE.OK);

            expect(response.payload).toBeDefined();

            const cartList = response.payload.carts
            expect(Array.isArray(cartList)).toBe(true);
            expect(cartList.length).toBeGreaterThan(0);
        });

    test('TC02-CART: Verify can get cart by user successfully',
        async ({ cartService }) => {
            const selectedUser = cartData.BASE.selectUser;
            const response = await cartService.getCartByUser(selectedUser);
            expect(response.status).toBe(STATUS_CODE.OK);

            expect(response.payload).toBeDefined();

            const cartList = response.payload.carts
            expect(Array.isArray(cartList)).toBe(true);
            expect(cartList.length).toBeGreaterThan(0);

            const allBelongToUser = cartList.every(cart => cart.userId === selectedUser)
            expect(allBelongToUser).toBe(true);

        });

    test('TC03-CART: Verify that can get a cart successfully',
        async ({ cartService }) => {
            const selectedCart = cartData.BASE.selectCart;
            const response = await cartService.getACart(selectedCart);
            expect(response.status).toBe(STATUS_CODE.OK)

            expect(response.payload).toBeDefined();
            expect(response.payload.id).toBe(selectedCart)

            const productsInCart = response.payload.products
            expect(Array.isArray(productsInCart)).toBe(true);
            expect(productsInCart.length).toBeGreaterThan(0);

            const totalInCart = productsInCart.reduce((acc, totalEachProd) => { return acc + totalEachProd.total }, 0)
            // console.error(totalInCart)
            const total = response.payload.total
            expect(totalInCart).toBeCloseTo(total)
        }
    )
})