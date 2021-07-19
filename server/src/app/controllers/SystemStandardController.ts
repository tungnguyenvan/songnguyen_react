import BaseController from "@app/framework/core/BaseController";
import SystemStandardRepository from "@app/app/repositories/SystemStandardRepository";

const NAME_SPACE = "SystemStandardController";

/**
 * SystemStandard Controller
 * @author tung.nguyenvan
 */
class SystemStandardController extends BaseController {
	constructor() {
		super(new SystemStandardRepository());
	}
}

export default SystemStandardController;
