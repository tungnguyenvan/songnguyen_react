import BaseModel from "@app/framework/core/BaseModel";
import ProductTypeSchema from "@app/app/schema/ProductTypeSchema";

const NAME_SPACE = "FILE_MODEL";

/**
 * File model
 * @author tung.nguyenvan
 */
class FileModel extends BaseModel {
	constructor() {
		super(ProductTypeSchema);
	}
}

export default FileModel;
