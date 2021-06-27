import BaseController from "@app/framework/core/BaseController";
import AddressRepository from "@app/app/repositories/AddressRepository";

const NAME_SPACE = "AddressController";

/**
 * Address Controller
 * @author tung.nguyenvan
 */
class AddressController extends BaseController {
	constructor() {
		super(new AddressRepository());
	}
}

export default AddressController;
