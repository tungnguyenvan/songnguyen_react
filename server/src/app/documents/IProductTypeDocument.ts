import IBaseDocument from "@app/framework/interfaces/IBaseDocument";
import { FormType } from "../constants/EnumConstant";

/**
 * Product type document
 * @author tung.nguyenvan
 */
interface IProductTypeDocument extends IBaseDocument {
    /**
     * Product type name
     */
    name: string;

    form_type: FormType;

    unit: string;
}

export default IProductTypeDocument;
