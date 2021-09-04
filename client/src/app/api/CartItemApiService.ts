import ICartItemModel from "app/documents/ICartItemModel";
import BaseApiService from "framework/api/BaseApiService";
import RequestPathConstant from "framework/constants/RequestPathConstant";

class CartItemApiService extends BaseApiService<ICartItemModel> {
    constructor() {
        super(RequestPathConstant.CART_ITEM);
    }
}

export default CartItemApiService;
