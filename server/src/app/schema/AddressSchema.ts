import Mongoose from "mongoose";
import BaseSchema from "@app/framework/core/BaseSchema";
import IAddressDocument from "@app/app/documents/IAddressDocument";
import DBNameConstant from "@app/framework/constants/DBNameConstant";

const document = {
    /**
     * Address of store
     */
    address: {
        require: true,
        type: String,
    },

    /**
     * Country of store
     */
    country: {
        require: true,
        type: String,
    },

    /**
     * City of store
     */
    city: {
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

export default Mongoose.model<IAddressDocument>(
    DBNameConstant.ADDRESS,
    fileschema
) as unknown as Mongoose.Model<Mongoose.Document>;
