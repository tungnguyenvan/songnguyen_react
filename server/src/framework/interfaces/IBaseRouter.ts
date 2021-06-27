import Express from "express";

interface IBaseRouter {
	getRouter(): Express.Router;
}

export default IBaseRouter;
