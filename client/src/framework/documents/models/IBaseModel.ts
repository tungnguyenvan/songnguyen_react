import UserModel from "./IUserModel";

interface IBaseModel {
	/**
	 * Record id
	 * */
	_id: string;

	/**
	 * Date create this record
	 * */
	createdAt: number;

	/**
	 *
	 */
	createdBy: UserModel;

	/**
	 *
	 */
	updatedAt: number;

	/**
	 *
	 */
	updatedBy: UserModel;

	/**
	 *
	 */
	deletedAt: number;
}

export default IBaseModel;
