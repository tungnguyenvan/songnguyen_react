import Mongoose from "mongoose";
import BaseSchema from "@app/framework/core/BaseSchema";
import ICartDocument from "@app/app/documents/ICartDocument";
import DBNameConstant from "@app/framework/constants/DBNameConstant";
import { CartStatus } from "../constants/EnumConstant";

const document = {
    customer: {
        type: Mongoose.Types.ObjectId,
        require: true,
        ref: DBNameConstant.CUSTOMER,
    },

    items: {
        type: [Mongoose.Types.ObjectId],
        require: true,
        ref: DBNameConstant.CART_ITEM,
    },

    status: {
        type: String,
        require: true,
        enum: CartStatus,
        default: CartStatus.DICUSS,
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

export default Mongoose.model<ICartDocument>(DBNameConstant.CART, fileschema) as unknown as Mongoose.Model<Mongoose.Document>;
