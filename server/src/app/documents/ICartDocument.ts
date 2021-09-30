import IBaseDocument from "@app/framework/interfaces/IBaseDocument";
import Mongoose from "mongoose";
import { CartStatus, CartStatusHistoryItem } from "../constants/EnumConstant";

/**
 * Cart document
 * @author tung.nguyenvan
 */
interface ICartDocument extends IBaseDocument {
    customer: Mongoose.Types.ObjectId | ICartDocument;
    items: Mongoose.Types.ObjectId[];
    status: CartStatus;
    history: CartStatusHistoryItem[];
}

export default ICartDocument;
