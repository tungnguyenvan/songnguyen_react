import BaseController from "@app/framework/core/BaseController";
import ThicknessRepository from "@app/app/repositories/ThicknessRepository";

const NAME_SPACE = "ThicknessController";

/**
 * Thickness Controller
 * @author tung.nguyenvan
 */
class ThicknessController extends BaseController {
	constructor() {
		super(new ThicknessRepository());
	}
}

export default ThicknessController;
