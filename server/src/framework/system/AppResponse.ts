import Express from "express";
import IAppResponse from "@app/framework/interfaces/IAppResponse";
import HttpRequestStatusCode from "@app/framework/constants/HttpRequestStatusCode";

class AppResponse implements IAppResponse {
	/**
	 * Response with status ok
	 * @param request
	 * @param response
	 * @param data
	 */
	ok(request: Express.Request, response: Express.Response, data: any): Express.Response {
		return response.status(HttpRequestStatusCode.OK).json({
			link: this.requestUrl(request),
			request_at: Date.now(),
			data,
			total: Array.isArray(data) ? data.length : undefined,
		});
	}

	/**
	 * Response with status created
	 * @param request
	 * @param response
	 * @param data
	 */
	created(request: Express.Request, response: Express.Response, data: any): Express.Response {
		return response.status(HttpRequestStatusCode.CREATED).json({
			link: this.requestUrl(request),
			request_at: Date.now(),
			data,
		});
	}

	/**
	 * Response with status request error
	 * @param request
	 * @param response
	 * @param error
	 */
	badRequest(request: Express.Request, response: Express.Response, error: any): Express.Response {
		return response.status(HttpRequestStatusCode.BAD_REQUEST).json({
			link: this.requestUrl(request),
			request_at: Date.now(),
			data: error,
		});
	}

	/**
	 * Response with status not found
	 * @param request
	 * @param response
	 * @returns response
	 */
	notFound(request: Express.Request, response: Express.Response): Express.Response {
		return response.status(HttpRequestStatusCode.NOT_FOUND).json({
			link: this.requestUrl(request),
			request_at: Date.now(),
		});
	}

	/**
	 * Response with status internal server error
	 * @param request
	 * @param response
	 * @returns response
	 */
	internalServerError(request: Express.Request, response: Express.Response): Express.Response {
		return response.status(HttpRequestStatusCode.INTERNAL_SERVER_ERROR).json({
			link: this.requestUrl(request),
			request_at: Date.now(),
		});
	}

	/**
	 * Response with status unAuthorized
	 * @param request
	 * @param response
	 * @returns response
	 */
	unAuthorized(request: Express.Request, response: Express.Response): Express.Response {
		return response.status(HttpRequestStatusCode.UNAUTHORIZED).json({
			link: this.requestUrl(request),
			request_at: Date.now(),
		});
	}

	conflict(request: Express.Request, response: Express.Response): Express.Response {
		return response.status(HttpRequestStatusCode.CONFLICT).json({
			link: this.requestUrl(request),
			request_at: Date.now(),
			data: request.body,
		});
	}

	/**
	 * this function will return request url from request object
	 * @returns request Url
	 */
	private requestUrl(request: Express.Request): string {
		return request.protocol + "://" + request.get("host") + request.originalUrl;
	}
}

export default AppResponse;
