import BaseModel from "@app/framework/core/BaseModel";
import AddressSchema from "@app/app/schema/AddressSchema";

const NAME_SPACE = "AddressModel";

/**
 * Address model
 * @author tung.nguyenvan
 */
class AddressModel extends BaseModel {
	constructor() {
		super(AddressSchema);
	}
}

export default AddressModel;
