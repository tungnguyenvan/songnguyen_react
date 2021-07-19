import BaseRouter from "@app/framework/core/BaseRouter";
import SystemStandardController from "@app/app/controllers/SystemStandardController";
import Logging from "@app/framework/utils/Logging";
import AppMiddleware from "@app/framework/system/AppMiddleware";
import BaseValidation from "@app/framework/core/BaseValidation";
import SystemStandardValidateDocument from "@app/app/validations/SystemStandardValidateDocument";
import RequestFieldConstant from "@app/framework/constants/RequestFieldConstant";

const NAME_SPACE = "SystemStandardRouter";

class SystemStandardRouter extends BaseRouter {
	constructor() {
		Logging.debug(NAME_SPACE, "SystemStandardRouter#constructor START");
		super(new SystemStandardController());
		Logging.debug(NAME_SPACE, "SystemStandardRouter#constructor END");
	}

	initializeMiddleware() {
		super.initializeMiddleware();

		this.baseRouterMiddleware.save.push(
			...[
				AppMiddleware.auth,
				new BaseValidation(SystemStandardValidateDocument.save, RequestFieldConstant.BODY).validate,
			]
		);
	}
}

export default SystemStandardRouter;
