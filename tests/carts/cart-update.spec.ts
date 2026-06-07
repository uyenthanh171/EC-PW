import { STATUS_CODE } from "../../config/constant";
import { test, expect } from "../../fixtures/cart.fixtures"
import cartData from "../../test-data/cart.data.json"

test.describe('CART - Update a cart', () => {
    
    test('TC05-CART: Verify can update products in cart', 
        async({cartService}) => {
            const selectedUser = cartData.BASE.selectUser;
            const UpdateCartRequest = cartData.UpdateProds;
            const response = await cartService.updateACart(selectedUser, UpdateCartRequest);
            expect(response.status).toBe(STATUS_CODE.OK);
            expect(response.payload).toBeDefined();

            const prodList = response.payload.products;
            const reqProdId = UpdateCartRequest.products.map(prodId => prodId.id)
            const resProdId = prodList.map(prodId => prodId.id)
            expect(resProdId).toEqual(expect.arrayContaining(reqProdId));

            expect(response.payload.userId).toBe(selectedUser)
        }
    )
})