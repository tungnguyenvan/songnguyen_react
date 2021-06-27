import BaseModel from "@app/framework/core/BaseModel";
import WarehouseSchema from "@app/app/schema/WarehouseSchema";

const NAME_SPACE = "WarehouseModel";

/**
 * Warehouse model
 * @author tung.nguyenvan
 */
class WarehouseModel extends BaseModel {
	constructor() {
		super(WarehouseSchema);
	}
}

export default WarehouseModel;
