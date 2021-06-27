import Mongoose from "mongoose";
import IBaseDocument from "@app/framework/interfaces/IBaseDocument";
import { UserRole, UserStatus } from "@app/framework/constants/DBEnumConstant";

/**
 * User Document
 * @author tung.nguyenvan
 */
interface IUserDocument extends IBaseDocument {
	/**
	 * Email of user
	 * Need to login
	 */
	email: string;

	/**
	 * Phone number of user
	 * Need to login
	 */
	phoneNumber: string;

	/**
	 * The interantional code
	 * VN | AF | ...
	 */
	internationalCode: string;

	/**
	 * Password for login
	 */
	password: string;

	/**
	 * First name
	 */
	firstName: string;

	/**
	 * Last name
	 */
	lastName: string;

	/**
	 * Avatar user
	 * file id
	 * refer to file schema
	 */
	avatar: Mongoose.Types.ObjectId;

	/**
	 * Birth date
	 * Timestamp
	 */
	birthDate: number;

	/**
	 * Role of user
	 */
	role: UserRole;

	/**
	 * User status
	 */
	status: UserStatus;

	/**
	 * Token
	 */
	token: string;
}

export default IUserDocument;
