import BaseController from "@app/framework/core/BaseController";
import StandardRepository from "@app/app/repositories/StandardRepository";

const NAME_SPACE = "StandardController";

/**
 * Standard Controller
 * @author tung.nguyenvan
 */
class StandardController extends BaseController {
	constructor() {
		super(new StandardRepository());
	}
}

export default StandardController;
