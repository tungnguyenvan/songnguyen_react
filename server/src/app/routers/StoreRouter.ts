import Logging from "@app/framework/utils/Logging";
import BaseRouter from "@app/framework/core/BaseRouter";
import AppMiddleware from "@app/framework/system/AppMiddleware";
import BaseValidation from "@app/framework/core/BaseValidation";
import StoreController from "@app/app/controllers/StoreController";
import StoreValidateDocument from "@app/app/validations/StoreValidateDocument";
import RequestFieldConstant from "@app/framework/constants/RequestFieldConstant";

const NAME_SPACE = "FileRouter";

class StoreRouter extends BaseRouter {
    constructor() {
        Logging.debug(NAME_SPACE, "FileRouter#constructor START");
        super(new StoreController());
        Logging.debug(NAME_SPACE, "FileRouter#constructor END");
    }

    initializeMiddleware() {
        super.initializeMiddleware();

        this.baseRouterMiddleware.all.push(...[AppMiddleware.auth]);
        this.baseRouterMiddleware.save.push(
            ...[AppMiddleware.auth, new BaseValidation(StoreValidateDocument.save, RequestFieldConstant.BODY).validate]
        );
    }
}

export default StoreRouter;
