import IBaseDocument from "@app/framework/interfaces/IBaseDocument";
import Mongoose from "mongoose";

/**
 * ProductName document
 * @author tung.nguyenvan
 */
interface IProductNameDocument extends IBaseDocument {
    /**
     * ProductName name
     */
    name: string;

    product_type: Mongoose.Types.ObjectId[];
}

export default IProductNameDocument;
