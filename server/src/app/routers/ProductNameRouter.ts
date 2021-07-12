import BaseRouter from "@app/framework/core/BaseRouter";
import ProductNameController from "@app/app/controllers/ProductNameController";
import Logging from "@app/framework/utils/Logging";
import AppMiddleware from "@app/framework/system/AppMiddleware";
import BaseValidation from "@app/framework/core/BaseValidation";
import ProductNameValidateDocument from "@app/app/validations/ProductNameValidateDocument";
import RequestFieldConstant from "@app/framework/constants/RequestFieldConstant";

const NAME_SPACE = "ProductNameRouter";

class ProductNameRouter extends BaseRouter {
	constructor() {
		Logging.debug(NAME_SPACE, "ProductNameRouter#constructor START");
		super(new ProductNameController());
		Logging.debug(NAME_SPACE, "ProductNameRouter#constructor END");
	}

	initializeMiddleware() {
		super.initializeMiddleware();

		this.baseRouterMiddleware.save.push(
			...[
				AppMiddleware.auth,
				new BaseValidation(ProductNameValidateDocument.save, RequestFieldConstant.BODY).validate,
			]
		);
	}
}

export default ProductNameRouter;
