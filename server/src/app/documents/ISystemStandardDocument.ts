import IBaseDocument from "@app/framework/interfaces/IBaseDocument";

/**
 * SystemStandard document
 * @author tung.nguyenvan
 */
interface ISystemStandardDocument extends IBaseDocument {
	/**
	 * SystemStandard name
	 */
	name: string;
}

export default ISystemStandardDocument;
