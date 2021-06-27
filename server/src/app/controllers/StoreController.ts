import BaseController from "@app/framework/core/BaseController";
import StoreRepository from "@app/app/repositories/StoreRepository";

const NAME_SPACE = "StoreController";

class StoreController extends BaseController {
	constructor() {
		super(new StoreRepository());
	}
}

export default StoreController;
