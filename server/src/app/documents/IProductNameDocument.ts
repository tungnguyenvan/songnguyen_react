import IBaseDocument from "@app/framework/interfaces/IBaseDocument";

/**
 * ProductName document
 * @author tung.nguyenvan
 */
interface IProductNameDocument extends IBaseDocument {
	/**
	 * ProductName name
	 */
	name: string;
}

export default IProductNameDocument;
