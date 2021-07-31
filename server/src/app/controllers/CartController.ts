import BaseController from "@app/framework/core/BaseController";
import CartRepository from "@app/app/repositories/CartRepository";

const NAME_SPACE = "CartController";

/**
 * Cart Controller
 * @author tung.nguyenvan
 */
class CartController extends BaseController {
	constructor() {
		super(new CartRepository());
	}
}

export default CartController;
