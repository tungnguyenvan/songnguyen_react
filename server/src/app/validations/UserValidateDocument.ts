import Rule from "@app/framework/core/Rule";
import RuleConstant from "@app/framework/constants/RuleConstant";
import IbaseValidateDocument from "@app/framework/interfaces/IbaseValidateDocument";

class UserValidateDocument {
	/**
	 * This is document will use for validate when user registration new account
	 */
	public static save: IbaseValidateDocument = {
		rules: [
			// required email or phone number
			new Rule("email", RuleConstant.REQUIRED, "Email is required"),

			// regex email
			new Rule(
				"email",
				RuleConstant.REGEXP,
				"Email need format abc@abc.com",
				/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
			),

			// required password
			new Rule("password", RuleConstant.REQUIRED, "Password is required"),

			// required first name
			new Rule("firstName", RuleConstant.REQUIRED, "First name is require"),

			// require last name
			new Rule("lastName", RuleConstant.REQUIRED, "Last name is require"),
		],
	};

	/**
	 * This is document will use for login
	 */
	public static login: IbaseValidateDocument = {
		rules: [
			// required email or phone number
			new Rule("email", RuleConstant.REQUIRED, "Email is required"),

			// required password
			new Rule("password", RuleConstant.REQUIRED, "Password is required"),
		],
	};
}

export default UserValidateDocument;
