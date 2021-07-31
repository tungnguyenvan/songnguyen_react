import BaseModel from "@app/framework/core/BaseModel";
import CartSchema from "@app/app/schema/CartSchema";

const NAME_SPACE = "CartModel";

/**
 * Cart model
 * @author tung.nguyenvan
 */
class CartModel extends BaseModel {
	constructor() {
		super(CartSchema);
	}
}

export default CartModel;
