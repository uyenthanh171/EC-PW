import { STATUS_CODE } from "../../config/constant";
import {test, expect} from "../../fixtures/cart.fixtures"
import cartData from "../../test-data/cart.data.json"

test.describe('CART - Delete a cart', () => {
    
    test('TC06-CART: Verify can delete a cart',
        async({cartService}) => {
            const selectCart = cartData.BASE.selectCart;
            const response = await cartService.deleteACart(selectCart);
            expect(response.status).toBe(STATUS_CODE.OK)
            expect(response.payload).toBeDefined();

            const isValidDate = !isNaN(Date.parse(response.payload.deletedOn))
            expect(response.payload.isDeleted).toBe(true);
            expect(isValidDate).toBe(true);

        }
    )
})