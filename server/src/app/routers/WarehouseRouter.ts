import BaseRouter from "@app/framework/core/BaseRouter";
import WarehouseController from "@app/app/controllers/WarehouseController";
import Logging from "@app/framework/utils/Logging";
import AppMiddleware from "@app/framework/system/AppMiddleware";
import BaseValidation from "@app/framework/core/BaseValidation";
import WarehouseValidateDocument from "@app/app/validations/WarehouseValidateDocument";
import RequestFieldConstant from "@app/framework/constants/RequestFieldConstant";

const NAME_SPACE = "WarehouseRouter";

class WarehouseRouter extends BaseRouter {
	constructor() {
		Logging.debug(NAME_SPACE, "WarehouseRouter#constructor START");
		super(new WarehouseController());
		Logging.debug(NAME_SPACE, "WarehouseRouter#constructor END");
	}

	initializeMiddleware() {
		super.initializeMiddleware();

		this.baseRouterMiddleware.save.push(
			...[
				AppMiddleware.auth,
				new BaseValidation(WarehouseValidateDocument.save, RequestFieldConstant.BODY).validate,
			]
		);
	}
}

export default WarehouseRouter;
