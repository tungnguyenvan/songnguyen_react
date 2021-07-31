import IBaseDocument from "@app/framework/interfaces/IBaseDocument";
import Mongoose from "mongoose";
import { CartStatus } from "../constants/EnumConstant";

/**
 * Cart document
 * @author tung.nguyenvan
 */
interface ICartDocument extends IBaseDocument {
    customer: Mongoose.Types.ObjectId;
    items: Mongoose.Types.ObjectId[];
    status: CartStatus;
}

export default ICartDocument;
