import BaseRouter from "@app/framework/core/BaseRouter";
import SizeController from "@app/app/controllers/SizeController";
import Logging from "@app/framework/utils/Logging";
import AppMiddleware from "@app/framework/system/AppMiddleware";
import BaseValidation from "@app/framework/core/BaseValidation";
import SizeValidateDocument from "@app/app/validations/SizeValidateDocument";
import RequestFieldConstant from "@app/framework/constants/RequestFieldConstant";

const NAME_SPACE = "SizeRouter";

class SizeRouter extends BaseRouter {
	constructor() {
		Logging.debug(NAME_SPACE, "SizeRouter#constructor START");
		super(new SizeController());
		Logging.debug(NAME_SPACE, "SizeRouter#constructor END");
	}

	initializeMiddleware() {
		super.initializeMiddleware();

		this.baseRouterMiddleware.save.push(
			...[
				AppMiddleware.auth,
				new BaseValidation(SizeValidateDocument.save, RequestFieldConstant.BODY).validate,
			]
		);
	}
}

export default SizeRouter;
