import Rule from "@app/framework/core/Rule";
import RuleConstant from "@app/framework/constants/RuleConstant";
import IbaseValidateDocument from "@app/framework/interfaces/IbaseValidateDocument";

class TagValidateDocument {
	public static save: IbaseValidateDocument = {
		rules: [
			/**
			 * Require name
			 */
			new Rule("name", RuleConstant.REQUIRED, "name is required"),

			/**
			 * Require Store id
			 */
			new Rule("store", RuleConstant.REQUIRED, "Store id is require"),
		],
	} as IbaseValidateDocument;
}

export default TagValidateDocument;
