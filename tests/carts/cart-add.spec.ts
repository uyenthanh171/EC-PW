import { STATUS_CODE } from "../../config/constant";
import { test, expect } from "../../fixtures/cart.fixtures";
import cartData from "../../test-data/cart.data.json"

test.describe('CART - Add a cart', () => {

    test('TC04-CART: Verify that can add a cart successfully',
        async ({ cartService }) => {
            const AddCartRequest = cartData.AddCartRequest
            const response = await cartService.addACart(AddCartRequest);
            expect(response.status).toBe(STATUS_CODE.CREATED);
            expect(response.payload.id).toBeDefined();
            expect(response.payload.userId).toBe(AddCartRequest.userId);

            // Check the quantity of product at response = request
            const totalQty = AddCartRequest.products.reduce((acc, cur) => {
                return acc + cur.quantity
            }, 0)
            expect(response.payload.totalQuantity).toBe(totalQty)

            // Check the productID of reponse = request
            const resProdId = response.payload.products.map(id => id.id).sort((a, b) => a - b)
            const reqProdId = AddCartRequest.products.map(id => id.id).sort((a, b) => a - b)
            expect(resProdId).toEqual(reqProdId)
        })
})