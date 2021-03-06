import Mongoose from "mongoose";
import BaseSchema from "@app/framework/core/BaseSchema";
import ISystemStandardDocument from "@app/app/documents/ISystemStandardDocument";
import DBNameConstant from "@app/framework/constants/DBNameConstant";

const document = {
    name: {
        require: true,
        type: String,
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

export default Mongoose.model<ISystemStandardDocument>(DBNameConstant.SYSTEM_STANDARD, fileschema) as unknown as Mongoose.Model<Mongoose.Document>;
