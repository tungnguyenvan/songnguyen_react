import BaseModel from "@app/framework/core/BaseModel";
import FileSchema from "@app/app/schema/FileSchema";

const NAME_SPACE = "FILE_MODEL";

/**
 * File model
 * @author tung.nguyenvan
 */
class FileModel extends BaseModel {
	constructor() {
		super(FileSchema);
	}
}

export default FileModel;
