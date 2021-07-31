import BaseController from "@app/framework/core/BaseController";
import CartItemRepository from "@app/app/repositories/CartItemRepository";

const NAME_SPACE = "CartItemController";

/**
 * CartItem Controller
 * @author tung.nguyenvan
 */
class CartItemController extends BaseController {
	constructor() {
		super(new CartItemRepository());
	}
}

export default CartItemController;
