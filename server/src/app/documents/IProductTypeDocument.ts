import IBaseDocument from "@app/framework/interfaces/IBaseDocument";

/**
 * Product type document
 * @author tung.nguyenvan
 */
interface IProductTypeDocument extends IBaseDocument {
	/**
	 * Product type name
	 */
	name: string;
}

export default IProductTypeDocument;
