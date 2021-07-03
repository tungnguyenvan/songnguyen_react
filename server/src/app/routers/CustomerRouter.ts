import BaseRouter from "@app/framework/core/BaseRouter";
import CustomerController from "@app/app/controllers/CustomerController";
import Logging from "@app/framework/utils/Logging";
import AppMiddleware from "@app/framework/system/AppMiddleware";
import BaseValidation from "@app/framework/core/BaseValidation";
import CustomerValidateDocument from "@app/app/validations/CustomerValidateDocument";
import RequestFieldConstant from "@app/framework/constants/RequestFieldConstant";

const NAME_SPACE = "CustomerRouter";

class CustomerRouter extends BaseRouter {
	constructor() {
		Logging.debug(NAME_SPACE, "CustomerRouter#constructor START");
		super(new CustomerController());
		Logging.debug(NAME_SPACE, "CustomerRouter#constructor END");
	}

	initializeMiddleware() {
		super.initializeMiddleware();

		this.baseRouterMiddleware.save.push(
			...[
				AppMiddleware.auth,
				new BaseValidation(CustomerValidateDocument.save, RequestFieldConstant.BODY).validate,
			]
		);
	}
}

export default CustomerRouter;
