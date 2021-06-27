import BaseModel from "@app/framework/core/BaseModel";
import UserSchema from "@app/app/schema/UserSchema";
import IUserDocument from "../documents/IUserDocument";
import Logging from "@app/framework/utils/Logging";

const NAME_SPACE = "UserModel";

/**
 * User model
 * @author tung.nguyenvan
 */
class UserModel extends BaseModel {
	constructor() {
		super(UserSchema);
	}

	login(loginRequest: IUserDocument): any {
		return this.schema.findOne({ email: loginRequest.email });
	}

	updateToken(id: string, token: string) {
		Logging.debug(NAME_SPACE, `${NAME_SPACE}#updateToken`, { id, token });
		this.schema
			.updateOne({ _id: id }, { token })
			.then((response) => {
				Logging.debug(NAME_SPACE, `${NAME_SPACE}#updateToken response`, response);
			})
			.catch((error) => {
				Logging.debug(NAME_SPACE, `${NAME_SPACE}#updateToken error`, error);
			});
	}
}

export default UserModel;
