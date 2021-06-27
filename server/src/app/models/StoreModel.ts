import BaseModel from "@app/framework/core/BaseModel";
import StoreSchema from "@app/app/schema/StoreSchema";

const NAME_SPACE = "StoreModel";

/**
 * File model
 * @author tung.nguyenvan
 */
class StoreModel extends BaseModel {
	constructor() {
		super(StoreSchema);
	}
}

export default StoreModel;
