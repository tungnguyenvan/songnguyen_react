import IBaseDocument from "@app/framework/interfaces/IBaseDocument";
import Mongoose from "mongoose";
import { CartItemSource, CartItemStatus, DiscountType } from "../constants/EnumConstant";

/**
 * CartItem document
 * @author tung.nguyenvan
 */
interface ICartItemDocument extends IBaseDocument {
    product_name: Mongoose.Types.ObjectId;
    product_type: Mongoose.Types.ObjectId;
    thickness: Mongoose.Types.ObjectId;
    system_standard: Mongoose.Types.ObjectId;
    standard: Mongoose.Types.ObjectId;
    size: Mongoose.Types.ObjectId;
    amount: number;
    unit_price: number;
    total_price: number;
    discount_type: DiscountType | string;
    discount_percent: number;
    status: CartItemStatus;
    delivered: number;
    source: CartItemSource;
}

export default ICartItemDocument;
