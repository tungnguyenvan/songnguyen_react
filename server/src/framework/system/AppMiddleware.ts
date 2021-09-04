import Express from "express";
import JsonWebToken from "jsonwebtoken";
import AppResponse from "@app/framework/system/AppResponse";
import AppUtil from "@app/framework/utils/AppUtil";
import AppConfig from "./AppConfig";
import Logging from "@app/framework/utils/Logging";

const NAME_SPACE = "AppMiddleware";

class AppMiddleware {
	/**
	 * Authentication middleware
	 * @param request
	 * @param response
	 * @param next
	 */
	public static auth(
		request: Express.Request,
		response: Express.Response,
		next: Express.NextFunction
	): void {
		const appResponse = new AppResponse();

		if (!request.headers.authorization) {
			appResponse.unAuthorized(request, response);
			return;
		}

		const tokenSplited: string[] = AppUtil.splitToken(request.headers.authorization);
		Logging.debug(NAME_SPACE, `${NAME_SPACE}#auth tokenSplited:`, tokenSplited);

		if (tokenSplited[0] === AppConfig.TOKEN_PREFIX) {
			JsonWebToken.verify(tokenSplited[1], AppConfig.JSON_WEB_TOKEN_KEY, (error, decoded) => {
				if (error) {
					appResponse.unAuthorized(request, response);
					return;
				}

				// TODO: handle activate account

				request.userinformation = decoded;
				next();
			});
		} else {
			appResponse.unAuthorized(request, response);
		}
	}
}

export default AppMiddleware;
