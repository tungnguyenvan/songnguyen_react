import BaseModel from "@app/framework/core/BaseModel";
import SizeSchema from "@app/app/schema/SizeSchema";

const NAME_SPACE = "SizeModel";

/**
 * Size model
 * @author tung.nguyenvan
 */
class SizeModel extends BaseModel {
	constructor() {
		super(SizeSchema);
	}
}

export default SizeModel;
