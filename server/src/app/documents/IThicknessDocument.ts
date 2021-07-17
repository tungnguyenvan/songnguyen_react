import IBaseDocument from "@app/framework/interfaces/IBaseDocument";
import Mongoose from "mongoose";

/**
 * Thickness document
 * @author tung.nguyenvan
 */
interface IThicknessDocument extends IBaseDocument {
    /**
     * Thickness name
     */
    name: string;

    price: number;

    product_name: Mongoose.Types.ObjectId;
}

export default IThicknessDocument;
