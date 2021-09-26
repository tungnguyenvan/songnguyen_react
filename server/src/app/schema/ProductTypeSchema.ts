import Mongoose from "mongoose";
import BaseSchema from "@app/framework/core/BaseSchema";
import IProductTypeDocument from "@app/app/documents/IProductTypeDocument";
import DBNameConstant from "@app/framework/constants/DBNameConstant";
import { FormType } from "../constants/EnumConstant";

const document = {
    name: {
        require: true,
        type: String,
    },

    form_type: {
        type: String,
        require: true,
        enum: FormType,
    },

    unit: {
        type: String,
        require: true,
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

const schema = new Mongoose.Schema(document).pre("save", BaseSchema.preSave).pre("updateOne", BaseSchema.preUpdate);

export default Mongoose.model<IProductTypeDocument>(DBNameConstant.PRODUCT_TYPE, schema) as unknown as Mongoose.Model<Mongoose.Document>;
