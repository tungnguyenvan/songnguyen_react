import Mongoose from "mongoose";
import IBaseDocument from "@app/framework/interfaces/IBaseDocument";

export default interface IBaseModel {
	/**
	 * get all record
	 * @author tung.nguyenvan
	 */
	all(): any;

	/**
	 * get one record by id
	 * @param id
	 * @author tung.nguyenvan
	 */
	get(id: Mongoose.Types.ObjectId): any;

	/**
	 * save a new record
	 * @author tung.nguyenvan
	 */
	save(item: IBaseDocument): Promise<Mongoose.Document>;

	/**
	 * update one record
	 * @author tung.nguyenvan
	 */
	updateOne(id: Mongoose.Types.ObjectId, document: IBaseDocument): any;
}
