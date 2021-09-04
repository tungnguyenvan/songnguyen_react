import Express from "express";

interface IBaseController {
    save(request: Express.Request, response: Express.Response): void;

    updateOne(request: Express.Request, response: Express.Response): void;

    all(request: Express.Request, response: Express.Response): void;

    get(request: Express.Request, response: Express.Response): void;

    delete(request: Express.Request, response: Express.Response): void;

    catchError(request: Express.Request, response: Express.Response, error: any): void;
}

export default IBaseController;
