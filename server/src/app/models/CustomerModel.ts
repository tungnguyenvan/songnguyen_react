import BaseModel from "@app/framework/core/BaseModel";
import CustomerSchema from "@app/app/schema/CustomerSchema";

const NAME_SPACE = "CustomerModel";

/**
 * Customer model
 * @author tung.nguyenvan
 */
class CustomerModel extends BaseModel {
	constructor() {
		super(CustomerSchema);
	}
}

export default CustomerModel;
