import BaseModel from "@app/framework/core/BaseModel";
import CartItemSchema from "@app/app/schema/CartItemSchema";

const NAME_SPACE = "CartItemModel";

/**
 * CartItem model
 * @author tung.nguyenvan
 */
class CartItemModel extends BaseModel {
	constructor() {
		super(CartItemSchema);
	}
}

export default CartItemModel;
