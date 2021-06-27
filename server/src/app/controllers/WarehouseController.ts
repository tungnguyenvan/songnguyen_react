import BaseController from "@app/framework/core/BaseController";
import WarehouseRepository from "@app/app/repositories/WarehouseRepository";

const NAME_SPACE = "WarehouseController";

/**
 * Warehouse Controller
 * @author tung.nguyenvan
 */
class WarehouseController extends BaseController {
	constructor() {
		super(new WarehouseRepository());
	}
}

export default WarehouseController;
