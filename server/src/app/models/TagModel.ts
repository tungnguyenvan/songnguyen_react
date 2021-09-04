import BaseModel from "@app/framework/core/BaseModel";
import TagSchema from "@app/app/schema/TagSchema";

const NAME_SPACE = "TagModel";

/**
 * Tag model
 * @author tung.nguyenvan
 */
class TagModel extends BaseModel {
	constructor() {
		super(TagSchema);
	}
}

export default TagModel;
