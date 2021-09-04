import Express from "express";
import IBaseRouter from "@app/framework/interfaces/IBaseRouter";
import BaseController from "@app/framework/core/BaseController";
import Logging from "@app/framework/utils/Logging";
import IBaseRouterMiddleware from "@app/framework/interfaces/IBaseRouterMiddleware";
import AppResponse from "../system/AppResponse";

const NAME_SPACE = "BaseRouter";

abstract class BaseRouter implements IBaseRouter {
    protected controller: BaseController;
    protected router: Express.Router = Express.Router();
    protected baseRouterMiddleware: IBaseRouterMiddleware;

    constructor(controller: BaseController, baseMiddleware: IBaseRouterMiddleware = {}) {
        Logging.debug(NAME_SPACE, "BaseRouter#constructor START");
        this.controller = controller;
        this.baseRouterMiddleware = baseMiddleware;

        this.initializeMiddleware();

        // base config
        this.initializeRouter();

        // binding
        this.routeNotFound = this.routeNotFound.bind(this);

        Logging.debug(NAME_SPACE, "BaseRouter#constructor END");
    }

    getRouter(): Express.Router {
        return this.router;
    }

    protected initializeMiddleware(): void {
        this.baseRouterMiddleware = {
            all: [],
            save: [],
            get: [],
            updateOne: [],
            delete: [],
        } as IBaseRouterMiddleware;
    }

    initializeRouter() {
        // router get all records
        this.router.get("/", this.baseRouterMiddleware.all, this.controller.all);

        // router create new records
        this.router.post("/", [...this.baseRouterMiddleware.save, this.controller.addUserInformationToBody], this.controller.save);

        // router get one record by id
        this.router.get("/:id", this.baseRouterMiddleware.get, this.controller.get);

        // router update one record by id
        this.router.put("/:id", [...this.baseRouterMiddleware.updateOne, this.controller.addUserInformationToBody], this.controller.updateOne);

        // router delete record by id
        this.router.delete("/:id", [...this.baseRouterMiddleware.delete, this.controller.addUserInformationToBody], this.controller.delete);
    }

    routeNotFound(request: Express.Request, response: Express.Response) {
        return new AppResponse().notFound(request, response);
    }
}

export default BaseRouter;
