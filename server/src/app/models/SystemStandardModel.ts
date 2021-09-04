import BaseModel from "@app/framework/core/BaseModel";
import SystemStandardSchema from "@app/app/schema/SystemStandardSchema";

const NAME_SPACE = "SystemStandardModel";

/**
 * SystemStandard model
 * @author tung.nguyenvan
 */
class SystemStandardModel extends BaseModel {
	constructor() {
		super(SystemStandardSchema);
	}
}

export default SystemStandardModel;
