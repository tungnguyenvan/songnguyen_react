import BaseRouter from "@app/framework/core/BaseRouter";
import StandardController from "@app/app/controllers/StandardController";
import Logging from "@app/framework/utils/Logging";
import AppMiddleware from "@app/framework/system/AppMiddleware";
import BaseValidation from "@app/framework/core/BaseValidation";
import StandardValidateDocument from "@app/app/validations/StandardValidateDocument";
import RequestFieldConstant from "@app/framework/constants/RequestFieldConstant";

const NAME_SPACE = "StandardRouter";

class StandardRouter extends BaseRouter {
	constructor() {
		Logging.debug(NAME_SPACE, "StandardRouter#constructor START");
		super(new StandardController());
		Logging.debug(NAME_SPACE, "StandardRouter#constructor END");
	}

	initializeMiddleware() {
		super.initializeMiddleware();

		this.baseRouterMiddleware.save.push(
			...[
				AppMiddleware.auth,
				new BaseValidation(StandardValidateDocument.save, RequestFieldConstant.BODY).validate,
			]
		);
	}
}

export default StandardRouter;
