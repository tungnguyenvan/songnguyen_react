import Express from "express";
import BaseController from "@app/framework/core/BaseController";
import TagRepository from "@app/app/repositories/TagRepository";
import Logging from "@app/framework/utils/Logging";

const NAME_SPACE = "TagController";

/**
 * Tag Controller
 * @author tung.nguyenvan
 */
class TagController extends BaseController {
	constructor() {
		super(new TagRepository());

		this.middlewareIsExist = this.middlewareIsExist.bind(this);
	}

	middlewareIsExist(
		request: Express.Request,
		response: Express.Response,
		next: Express.NextFunction
	) {
		(this.repository as TagRepository).middlewareIsExist(request).then((tags: boolean) => {
			if (tags) this.appResponse.conflict(request, response);
			else next();
		});
	}
}

export default TagController;
