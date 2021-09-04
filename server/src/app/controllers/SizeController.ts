import BaseController from "@app/framework/core/BaseController";
import SizeRepository from "@app/app/repositories/SizeRepository";

const NAME_SPACE = "SizeController";

/**
 * Size Controller
 * @author tung.nguyenvan
 */
class SizeController extends BaseController {
	constructor() {
		super(new SizeRepository());
	}
}

export default SizeController;
