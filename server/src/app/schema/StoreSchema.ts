import Mongoose from "mongoose";
import BaseSchema from "@app/framework/core/BaseSchema";
import IStoreDocument from "@app/app/documents/IStoreDocument";
import DBNameConstant from "@app/framework/constants/DBNameConstant";

const document = {
    name: {
        require: true,
        type: String,
    },

    address: {
        require: true,
        ref: DBNameConstant.ADDRESS,
        type: Mongoose.Types.ObjectId,
    },

    avatar: {
        require: true,
        ref: DBNameConstant.FILE,
        type: Mongoose.Types.ObjectId,
    },

    members: {
        require: true,
        ref: DBNameConstant.USER,
        type: [Mongoose.Types.ObjectId], // TODO Handle role for memebers
    },

    warehouses: {
        require: true,
        ref: DBNameConstant.WAREHOUSE,
        type: [Mongoose.Types.ObjectId],
    },

    createdAt: {
        type: Number,
        require: true,
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

const storeSchema = new Mongoose.Schema(document)
    .pre("save", BaseSchema.preSave)
    .pre("updateOne", BaseSchema.preUpdate);

export default Mongoose.model<IStoreDocument>(
    DBNameConstant.STORE,
    storeSchema
) as unknown as Mongoose.Model<Mongoose.Document>;
