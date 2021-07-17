import Express from "express";
import IBaseController from "@app/framework/interfaces/IBaseController";
import BaseRepository from "@app/framework/core/BaseRepository";
import AppResponse from "@app/framework/system/AppResponse";
import Logging from "@app/framework/utils/Logging";

const NAME_SPACE = "BaseController";

abstract class BaseController implements IBaseController {
    protected repository: BaseRepository;
    protected appResponse: AppResponse;

    constructor(repository: BaseRepository) {
        Logging.debug(NAME_SPACE, "BaseController#constructor START");
        this.repository = repository;
        this.appResponse = new AppResponse();

        // Binding
        this.all = this.all.bind(this);
        this.get = this.get.bind(this);
        this.save = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.updateOne = this.updateOne.bind(this);
        this.catchError = this.catchError.bind(this);
        this.addUserInformationToBody = this.addUserInformationToBody.bind(this);

        Logging.debug(NAME_SPACE, "BaseController#constructor END");
    }

    save(request: Express.Request, response: Express.Response): void {
        try {
            this.repository
                .save(request)
                .then((responseData) => {
                    this.appResponse.created(request, response, responseData);
                })
                .catch((error) => {
                    this.appResponse.badRequest(request, response, error);
                });
        } catch (error) {
            this.catchError(request, response, error);
        }
    }

    updateOne(request: Express.Request, response: Express.Response): void {
        try {
            this.repository.updateOne(request).then((responseData) => {
                if (responseData) this.get(request, response);
                else this.appResponse.notFound(request, response);
            });
        } catch (error) {
            this.catchError(request, response, error);
        }
    }

    all(request: Express.Request, response: Express.Response): void {
        try {
            this.repository
                .all(request)
                .then((responseData) => {
                    Logging.debug(NAME_SPACE, `${NAME_SPACE}#all`, responseData);
                    this.appResponse.ok(request, response, responseData);
                })
                .catch((error) => {
                    this.appResponse.badRequest(request, response, error);
                });
        } catch (error: any) {
            Logging.error(NAME_SPACE, "BaseController#all", error);
            this.appResponse.badRequest(request, response, error);
        }
    }

    get(request: Express.Request, response: Express.Response): void {
        try {
            this.repository
                .get(request)
                .then((responseData) => {
                    Logging.debug(NAME_SPACE, `${NAME_SPACE}#get`, responseData);
                    if (responseData) {
                        this.appResponse.ok(request, response, responseData);
                    } else {
                        this.appResponse.notFound(request, response);
                    }
                })
                .catch((error) => {
                    this.catchError(request, response, error);
                });
        } catch (error: any) {
            this.catchError(request, response, error);
        }
    }

    delete(request: Express.Request, response: Express.Response): void {
        try {
            this.repository.delete(request).then((responseData) => {
                this.appResponse.ok(request, response, responseData);
            });
        } catch (error: any) {
            this.catchError(request, response, error);
        }
    }

    addUserInformationToBody(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
        if (!request.userinformation) {
            return next();
        }

        if (request.method === "POST") {
            request.body.createdBy = request.userinformation._id;
        }

        request.body.updatedBy = request.userinformation._id;

        next();
    }

    catchError(request: Express.Request, response: Express.Response, error: any): void {
        Logging.error(NAME_SPACE, "BaseController#all", error);
        this.appResponse.badRequest(request, response, error);
    }
}

export default BaseController;
