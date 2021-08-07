import Mongoose from "mongoose";
import BaseSchema from "@app/framework/core/BaseSchema";
import ICartItemDocument from "@app/app/documents/ICartItemDocument";
import DBNameConstant from "@app/framework/constants/DBNameConstant";
import { CartItemSource, CartItemStatus, DiscountType } from "../constants/EnumConstant";

const document = {
    product_name: {
        type: Mongoose.Types.ObjectId,
        require: true,
        ref: DBNameConstant.PRODUCT_NAME,
    },

    product_type: {
        type: Mongoose.Types.ObjectId,
        require: true,
        ref: DBNameConstant.PRODUCT_TYPE,
    },

    thickness: {
        type: Mongoose.Types.ObjectId,
        require: true,
        ref: DBNameConstant.THICKNESS,
    },

    system_standard: {
        type: Mongoose.Types.ObjectId,
        require: true,
        ref: DBNameConstant.SYSTEM_STANDARD,
    },

    standard: {
        type: Mongoose.Types.ObjectId,
        require: true,
        ref: DBNameConstant.STANDARD,
    },

    size: {
        require: true,
        ref: DBNameConstant.SIZE,
        type: Mongoose.Types.ObjectId,
    },

    amount: {
        type: Number,
        require: true,
    },

    unit_price: {
        require: true,
        type: Number,
    },

    total_price: {
        require: true,
        type: Number,
    },

    discount_type: {
        type: String,
        enum: DiscountType,
    },

    discount_percent: {
        type: Number,
        require: true,
    },

    status: {
        type: String,
        require: true,
        enum: CartItemStatus,
    },

    delivered: {
        type: Number,
        require: true,
        default: 0,
    },

    source: {
        type: String,
        enum: CartItemSource,
        default: CartItemSource.DIY,
    },

    createdAt: {
        require: true,
        type: Number,
    },

    createdBy: {
        require: true,
        ref: DBNameConstant.USER,
        type: Mongoose.Types.ObjectId,
    },

    updatedAt: {
        type: Number,
        require: true,
    },

    updatedBy: {
        require: true,
        ref: DBNameConstant.USER,
        type: Mongoose.Types.ObjectId,
    },

    deleteAt: {
        require: true,
        type: Number,
    },

    deleteBy: {
        require: true,
        ref: DBNameConstant.USER,
        type: Mongoose.Types.ObjectId,
    },
};

const fileschema = new Mongoose.Schema(document).pre("save", BaseSchema.preSave).pre("updateOne", BaseSchema.preUpdate);

export default Mongoose.model<ICartItemDocument>(DBNameConstant.CART_ITEM, fileschema) as unknown as Mongoose.Model<Mongoose.Document>;
