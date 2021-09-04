import BaseController from "@app/framework/core/BaseController";
import CustomerRepository from "@app/app/repositories/CustomerRepository";

const NAME_SPACE = "CustomerController";

/**
 * Customer Controller
 * @author tung.nguyenvan
 */
class CustomerController extends BaseController {
	constructor() {
		super(new CustomerRepository());
	}
}

export default CustomerController;
