import Rule from "@app/framework/core/Rule";
import RuleConstant from "@app/framework/constants/RuleConstant";
import IbaseValidateDocument from "@app/framework/interfaces/IbaseValidateDocument";

class ThicknessValidateDocument {
	public static save: IbaseValidateDocument = {
		rules: [
			/**
			 * Require name
			 */
			new Rule("name", RuleConstant.REQUIRED, "name is required")
		],
	} as IbaseValidateDocument;
}

export default ThicknessValidateDocument;
