import Express from "express";

interface IAppResponse {
	/**
	 * Response with status ok
	 * @param request
	 * @param response
	 * @param data
	 */
	ok(
		request: Express.Request,
		response: Express.Response,
		data: any
	): Express.Response;

	/**
	 * Response with status created
	 * @param request
	 * @param response
	 * @param data
	 */
	created(
		request: Express.Request,
		response: Express.Response,
		data: any
	): Express.Response;

	/**
	 * Response with status request error
	 * @param request
	 * @param response
	 * @param error
	 */
	badRequest(
		request: Express.Request,
		response: Express.Response,
		error: any
	): Express.Response;

	/**
	 * Response with status not found
	 * @param request
	 * @param response
	 */
	notFound(
		request: Express.Request,
		response: Express.Response
	): Express.Response;
}

export default IAppResponse;
