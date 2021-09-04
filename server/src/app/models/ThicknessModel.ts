import BaseModel from "@app/framework/core/BaseModel";
import ThicknessSchema from "@app/app/schema/ThicknessSchema";

const NAME_SPACE = "ThicknessModel";

/**
 * Thickness model
 * @author tung.nguyenvan
 */
class ThicknessModel extends BaseModel {
	constructor() {
		super(ThicknessSchema);
	}
}

export default ThicknessModel;
