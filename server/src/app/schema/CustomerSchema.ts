import Mongoose from "mongoose";
import BaseSchema from "@app/framework/core/BaseSchema";
import ICustomerDocument from "@app/app/documents/ICustomerDocument";
import DBNameConstant from "@app/framework/constants/DBNameConstant";

const document = {
    name: {
        require: true,
        type: String,
    },

    address: {
        require: true,
        type: String,
    },

    tax: {
        require: true,
        type: String,
    },

    email: {
        require: true,
        type: String,
    },

    phone_number: {
        require: true,
        type: String,
    },

    contact_name: {
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

export default Mongoose.model<ICustomerDocument>(DBNameConstant.CUSTOMER, fileschema) as unknown as Mongoose.Model<Mongoose.Document>;
