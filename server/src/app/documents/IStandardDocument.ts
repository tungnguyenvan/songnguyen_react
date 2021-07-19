import IBaseDocument from "@app/framework/interfaces/IBaseDocument";

/**
 * Standard document
 * @author tung.nguyenvan
 */
interface IStandardDocument extends IBaseDocument {
	/**
	 * Standard name
	 */
	name: string;
}

export default IStandardDocument;
