import { UserRole, UserStatus } from "framework/constants/UserEnumConstant";
import IBaseModel from "./IBaseModel";

interface IUserModel extends IBaseModel {
	_id: string;
	email: string;
	phoneNumber: string;
	internationalCode: string;
	firstName: string;
	lastName: string;
	password: string;
	avatar: string;
	birthDate: number;
	role: UserRole;
	status: UserStatus;
	token: string;
}

export default IUserModel;
