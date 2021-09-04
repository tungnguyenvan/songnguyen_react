import BaseRouter from "@app/framework/core/BaseRouter";
import ThicknessController from "@app/app/controllers/ThicknessController";
import Logging from "@app/framework/utils/Logging";
import AppMiddleware from "@app/framework/system/AppMiddleware";
import BaseValidation from "@app/framework/core/BaseValidation";
import ThicknessValidateDocument from "@app/app/validations/ThicknessValidateDocument";
import RequestFieldConstant from "@app/framework/constants/RequestFieldConstant";

const NAME_SPACE = "ThicknessRouter";

class ThicknessRouter extends BaseRouter {
	constructor() {
		Logging.debug(NAME_SPACE, "ThicknessRouter#constructor START");
		super(new ThicknessController());
		Logging.debug(NAME_SPACE, "ThicknessRouter#constructor END");
	}

	initializeMiddleware() {
		super.initializeMiddleware();

		this.baseRouterMiddleware.save.push(
			...[
				AppMiddleware.auth,
				new BaseValidation(ThicknessValidateDocument.save, RequestFieldConstant.BODY).validate,
			]
		);
	}
}

export default ThicknessRouter;
