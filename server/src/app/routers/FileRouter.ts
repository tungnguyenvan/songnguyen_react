import BaseRouter from "@app/framework/core/BaseRouter";
import FileController from "@app/app/controllers/FileController";
import Logging from "@app/framework/utils/Logging";
import FileStorage from "@app/framework/system/FileStorage";
import BaseValidation from "@app/framework/core/BaseValidation";
import FileValidateDocument from "@app/app/validations/FileValidateDocument";
import RequestFieldConstant from "@app/framework/constants/RequestFieldConstant";

const NAME_SPACE = "FileRouter";

class FileRouter extends BaseRouter {
	private fileStorage: FileStorage;

	constructor() {
		Logging.debug(NAME_SPACE, "FileRouter#constructor START");
		super(new FileController());
		Logging.debug(NAME_SPACE, "FileRouter#constructor END");
	}

	initializeMiddleware() {
		super.initializeMiddleware();

		this.fileStorage = new FileStorage();

		this.baseRouterMiddleware.save.push(
			...[
				this.fileStorage.getMulter().single(RequestFieldConstant.FILE),
				new BaseValidation(FileValidateDocument.upload, RequestFieldConstant.FILE).validate,
				this.fileStorage.single,
			]
		);
	}
}

export default FileRouter;
