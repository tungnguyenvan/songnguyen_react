import IBaseDocument from "@app/framework/interfaces/IBaseDocument";
import Mongoose from "mongoose";

/**
 * Warehouse document
 * @author tung.nguyenvan
 */
interface IWarehouseDocument extends IBaseDocument {
    /**
     * Warehouse name
     */
    name: string;

    /**
     * Avatar refer to file
     */
    avatar: Mongoose.Types.ObjectId;

    /**
     * Full address of warehouse
     */
    address: Mongoose.Types.ObjectId;
}

export default IWarehouseDocument;
