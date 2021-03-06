import Logging from "@app/framework/utils/Logging";
import BaseRouter from "@app/framework/core/BaseRouter";
import ProductTypeController from "@app/app/controllers/ProductTypeController";
import AppMiddleware from "@app/framework/system/AppMiddleware";

const NAME_SPACE = "ProductTypeRouter";

class ProductTypeRouter extends BaseRouter {
    constructor() {
        Logging.debug(NAME_SPACE, "FileRouter#constructor START");
        super(new ProductTypeController());
        Logging.debug(NAME_SPACE, "FileRouter#constructor END");
    }

    initializeMiddleware() {
        super.initializeMiddleware();

        this.baseRouterMiddleware.save.push(...[AppMiddleware.auth]);
    }
}

export default ProductTypeRouter;
