import Rule from "@app/framework/core/Rule";
import RuleConstant from "@app/framework/constants/RuleConstant";
import IbaseValidateDocument from "@app/framework/interfaces/IbaseValidateDocument";

class StoreValidateDocument {
	public static save: IbaseValidateDocument = {
		rules: [
			/**
			 * Require name
			 */
			new Rule("name", RuleConstant.REQUIRED, "Name is require"),

			/**
			 * Require address
			 */
			new Rule("address", RuleConstant.REQUIRED, "Address is require"),

			/**
			 * Require country
			 */
			new Rule("country", RuleConstant.REQUIRED, "Country is require"),

			/**
			 * Require city
			 */
			new Rule("city", RuleConstant.REQUIRED, "City is require"),

			/**
			 * Require avatar
			 */
			new Rule("avatar", RuleConstant.REQUIRED, "Avatar is require"),
		],
	};
}

export default StoreValidateDocument;
