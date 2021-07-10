import Express from "express";

interface IBaseRouterMiddleware {
    all?: ((request: Express.Request, response: Express.Response, next: Express.NextFunction) => void)[];

    save?: ((request: Express.Request, response: Express.Response, next: Express.NextFunction) => void)[];

    get?: ((request: Express.Request, response: Express.Response, next: Express.NextFunction) => void)[];

    updateOne?: ((request: Express.Request, response: Express.Response, next: Express.NextFunction) => void)[];

    delete?: ((request: Express.Request, response: Express.Response, next: Express.NextFunction) => void)[];
}

export default IBaseRouterMiddleware;
