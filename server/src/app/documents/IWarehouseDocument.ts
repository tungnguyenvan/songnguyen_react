import IBaseDocument from "@app/framework/interfaces/IBaseDocument";
import Mongoose from "mongoose";

/**
 * Warehouse document
 * @author tung.nguyenvan
 */
interface IWarehouseDocument extends IBaseDocument {
    product_name: Mongoose.Types.ObjectId;
    product_type: Mongoose.Types.ObjectId;
    thickness: Mongoose.Types.ObjectId;
    system_standard: Mongoose.Types.ObjectId;
    standard: Mongoose.Types.ObjectId;
    size: Mongoose.Types.ObjectId;
    amount: number;
    price: number;
}

export default IWarehouseDocument;
