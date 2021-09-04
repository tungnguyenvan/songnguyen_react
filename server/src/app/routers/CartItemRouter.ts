import BaseRouter from "@app/framework/core/BaseRouter";
import CartItemController from "@app/app/controllers/CartItemController";
import Logging from "@app/framework/utils/Logging";
import AppMiddleware from "@app/framework/system/AppMiddleware";
import BaseValidation from "@app/framework/core/BaseValidation";
import CartItemValidateDocument from "@app/app/validations/CartItemValidateDocument";
import RequestFieldConstant from "@app/framework/constants/RequestFieldConstant";

const NAME_SPACE = "CartItemRouter";

class CartItemRouter extends BaseRouter {
	constructor() {
		Logging.debug(NAME_SPACE, "CartItemRouter#constructor START");
		super(new CartItemController());
		Logging.debug(NAME_SPACE, "CartItemRouter#constructor END");
	}

	initializeMiddleware() {
		super.initializeMiddleware();

		this.baseRouterMiddleware.save.push(
			...[
				AppMiddleware.auth,
				new BaseValidation(CartItemValidateDocument.save, RequestFieldConstant.BODY).validate,
			]
		);
	}
}

export default CartItemRouter;
