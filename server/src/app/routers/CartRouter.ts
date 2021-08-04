import BaseRouter from "@app/framework/core/BaseRouter";
import CartController from "@app/app/controllers/CartController";
import Logging from "@app/framework/utils/Logging";
import AppMiddleware from "@app/framework/system/AppMiddleware";
import BaseValidation from "@app/framework/core/BaseValidation";
import CartValidateDocument from "@app/app/validations/CartValidateDocument";
import RequestFieldConstant from "@app/framework/constants/RequestFieldConstant";

const NAME_SPACE = "CartRouter";

class CartRouter extends BaseRouter {
    constructor() {
        Logging.debug(NAME_SPACE, "CartRouter#constructor START");
        super(new CartController());

        this.router.get("/download/:id", [AppMiddleware.auth], (this.controller as CartController).download);

        Logging.debug(NAME_SPACE, "CartRouter#constructor END");
    }

    initializeMiddleware() {
        super.initializeMiddleware();

        this.baseRouterMiddleware.save.push(...[AppMiddleware.auth, new BaseValidation(CartValidateDocument.save, RequestFieldConstant.BODY).validate]);
    }
}

export default CartRouter;
