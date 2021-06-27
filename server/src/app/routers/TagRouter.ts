import BaseRouter from "@app/framework/core/BaseRouter";
import TagController from "@app/app/controllers/TagController";
import Logging from "@app/framework/utils/Logging";
import BaseValidation from "@app/framework/core/BaseValidation";
import TagValidateDocument from "@app/app/validations/TagValidateDocument";
import RequestFieldConstant from "@app/framework/constants/RequestFieldConstant";
import AppMiddleware from "@app/framework/system/AppMiddleware";

const NAME_SPACE = "TagRouter";

class TagRouter extends BaseRouter {
	constructor() {
		Logging.debug(NAME_SPACE, "TagRouter#constructor START");
		super(new TagController());
		Logging.debug(NAME_SPACE, "TagRouter#constructor END");
	}

	initializeMiddleware() {
		super.initializeMiddleware();

		// save middleware
		this.baseRouterMiddleware.save.push(
			...[
				AppMiddleware.auth,
				new BaseValidation(TagValidateDocument.save, RequestFieldConstant.BODY).validate,
				(this.controller as TagController).middlewareIsExist,
			]
		);

		// disable update tag
		this.baseRouterMiddleware.updateOne.push(this.routeNotFound);
	}
}

export default TagRouter;
