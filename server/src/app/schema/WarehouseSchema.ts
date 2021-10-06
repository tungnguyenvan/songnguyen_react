import Mongoose from "mongoose";
import BaseSchema from "@app/framework/core/BaseSchema";
import IWarehouseDocument from "@app/app/documents/IWarehouseDocument";
import DBNameConstant from "@app/framework/constants/DBNameConstant";

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
        ref: DBNameConstant.SYSTEM_STANDARD,
    },

    standard: {
        type: Mongoose.Types.ObjectId,
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
        default: 0,
    },

    price: {
        type: Number,
        default: 0,
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

export default Mongoose.model<IWarehouseDocument>(DBNameConstant.WAREHOUSE, fileschema) as unknown as Mongoose.Model<Mongoose.Document>;
