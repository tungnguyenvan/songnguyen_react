import BaseController from "@app/framework/core/BaseController";
import FileRepository from "@app/app/repositories/FileRepository";

const NAME_SPACE = "FileController";

class FileController extends BaseController {
	constructor() {
		super(new FileRepository());
	}
}

export default FileController;
