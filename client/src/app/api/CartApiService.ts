import ICartModel from "app/documents/ICartModel";
import BaseApiService from "framework/api/BaseApiService";
import RequestPathConstant from "framework/constants/RequestPathConstant";

class CartApiService extends BaseApiService<ICartModel> {
    constructor() {
        super(RequestPathConstant.CART);
    }
}

export default CartApiService;
