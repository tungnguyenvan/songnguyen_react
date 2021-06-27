import BaseRouter from "@app/framework/core/BaseRouter";
import AddressController from "@app/app/controllers/AddressController";
import Logging from "@app/framework/utils/Logging";
import AppMiddleware from "@app/framework/system/AppMiddleware";
import BaseValidation from "@app/framework/core/BaseValidation";
import AddressValidateDocument from "@app/app/validations/AddressValidateDocument";
import RequestFieldConstant from "@app/framework/constants/RequestFieldConstant";

const NAME_SPACE = "AddressRouter";

class AddressRouter extends BaseRouter {
    constructor() {
        Logging.debug(NAME_SPACE, "AddressRouter#constructor START");
        super(new AddressController());
        Logging.debug(NAME_SPACE, "AddressRouter#constructor END");
    }

    initializeMiddleware() {
        super.initializeMiddleware();

        this.baseRouterMiddleware.save.push(
            ...[
                AppMiddleware.auth,
                new BaseValidation(AddressValidateDocument.save, RequestFieldConstant.BODY).validate,
                AddressValidateDocument.middlewareSave,
            ]
        );
    }
}

export default AddressRouter;
