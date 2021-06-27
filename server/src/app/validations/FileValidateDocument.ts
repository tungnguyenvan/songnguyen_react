import RuleConstant from "@app/framework/constants/RuleConstant";
import Rule from "@app/framework/core/Rule";
import IbaseValidateDocument from "@app/framework/interfaces/IbaseValidateDocument";

class FileValidateDocument {
    public static upload: IbaseValidateDocument = {
        rules: [new Rule("originalname", RuleConstant.REQUIRED, "originalname is required")],
    } as IbaseValidateDocument;
}

export default FileValidateDocument;
