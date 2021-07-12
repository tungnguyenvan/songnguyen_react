import Mongoose from "mongoose";
import BaseSchema from "@app/framework/core/BaseSchema";
import IProductNameDocument from "@app/app/documents/IProductNameDocument";
import DBNameConstant from "@app/framework/constants/DBNameConstant";

const document = {
    name: {
        require: true,
        type: String,
    },

    type: {
        require: true,
        type: Mongoose.Types.ObjectId,
        ref: DBNameConstant.PRODUCT_TYPE,
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

export default Mongoose.model<IProductNameDocument>(DBNameConstant.PRODUCT_NAME, fileschema) as unknown as Mongoose.Model<Mongoose.Document>;
