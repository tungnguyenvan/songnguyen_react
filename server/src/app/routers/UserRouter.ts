import Logging from "@app/framework/utils/Logging";
import BaseRouter from "@app/framework/core/BaseRouter";
import AppMiddleware from "@app/framework/system/AppMiddleware";
import BaseValidation from "@app/framework/core/BaseValidation";
import UserController from "@app/app/controllers/UserController";
import UserValidateDocument from "@app/app/validations/UserValidateDocument";
import RequestFieldConstant from "@app/framework/constants/RequestFieldConstant";

const NAME_SPACE = "UserRouter";

class UserRouter extends BaseRouter {
    constructor() {
        Logging.debug(NAME_SPACE, "UserRouter#constructor START");
        super(new UserController());

        // Login router
        this.router.post(
            "/login",
            [new BaseValidation(UserValidateDocument.login, RequestFieldConstant.BODY).validate], // (this.controller as UserController).endcodingRequestPassword],
            (this.controller as UserController).login
        );

        this.router.get("/info/me", [AppMiddleware.auth], (this.controller as UserController).me);
        this.router.put("/change_password/:id", [
            AppMiddleware.auth,
            // (this.controller as UserController).prepareSaveUserInformation,
            (this.controller as UserController).middlewareUpdateUser,
            (this.controller as UserController).changePassword,
        ]);

        // biding
        this.initializeMiddleware = this.initializeMiddleware.bind(this);

        Logging.debug(NAME_SPACE, "UserRouter#constructor END");
    }

    /**
     * Initialize middleware
     * This function can call by BaseRouter
     */
    protected initializeMiddleware(): void {
        super.initializeMiddleware();

        this.baseRouterMiddleware.save.push(
            ...[new BaseValidation(UserValidateDocument.save, RequestFieldConstant.BODY).validate, (this.controller as UserController).prepareSaveUserInformation]
        );

        this.baseRouterMiddleware.updateOne.push(
            ...[AppMiddleware.auth, (this.controller as UserController).middlewareUpdateUser, (this.controller as UserController).endcodingRequestPassword]
        );
    }
}

export default UserRouter;
