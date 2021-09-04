import Mongoose from "mongoose";
import IBaseDocument from "@app/framework/interfaces/IBaseDocument";

/**
 * Tag document
 * @author tung.nguyenvan
 */
interface ITagDocument extends IBaseDocument {
	/**
	 * Tag name
	 */
	name: string;

	/**
	 * Tag of store
	 */
	store: Mongoose.Types.ObjectId;
}

export default ITagDocument;
