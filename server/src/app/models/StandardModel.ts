import BaseModel from "@app/framework/core/BaseModel";
import StandardSchema from "@app/app/schema/StandardSchema";

const NAME_SPACE = "StandardModel";

/**
 * Standard model
 * @author tung.nguyenvan
 */
class StandardModel extends BaseModel {
	constructor() {
		super(StandardSchema);
	}
}

export default StandardModel;
