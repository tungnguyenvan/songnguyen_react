import Mongoose from "mongoose";
import BaseSchema from "@app/framework/core/BaseSchema";
import IUserDocument from "@app/app/documents/IUserDocument";
import DBNameConstant from "@app/framework/constants/DBNameConstant";
import { UserRole, UserStatus } from "@app/framework/constants/DBEnumConstant";

const userDocument = {
    email: {
        type: String,
        unique: true,
        math: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },

    phoneNumber: {
        type: String,
    },

    internationalCode: {
        type: String,
    },

    password: {
        type: String,
        require: true,
    },

    firstName: {
        type: String,
        require: true,
    },

    lastName: {
        type: String,
        require: true,
    },

    avatar: {
        ref: DBNameConstant.FILE,
        type: Mongoose.Types.ObjectId,
    },

    birthDate: {
        type: Number,
        require: true,
    },

    role: {
        type: String,
        require: true,
        enum: UserRole,
        default: UserRole.SELLER,
    },

    status: {
        type: String,
        require: true,
        enum: UserStatus,
        default: UserStatus.JUST_CREATED,
    },

    token: {
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
        type: Number,
    },

    deleteBy: {
        ref: DBNameConstant.USER,
        type: Mongoose.Types.ObjectId,
    },
};

const userSchema = new Mongoose.Schema(userDocument).pre("save", BaseSchema.preSave).pre("updateOne", BaseSchema.preUpdate);

export default Mongoose.model<IUserDocument>(DBNameConstant.USER, userSchema) as unknown as Mongoose.Model<Mongoose.Document>;
