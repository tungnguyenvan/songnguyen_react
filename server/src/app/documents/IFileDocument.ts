import IBaseDocument from "@app/framework/interfaces/IBaseDocument";

/**
 * File document
 * @author tung.nguyenvan
 */
interface IFileDocument extends IBaseDocument {
	/**
	 * Url can get from clound storage
	 */
	url: string;

	/**
	 * File name has been storage at clound storage
	 */
	filename: string;
}

export default IFileDocument;
