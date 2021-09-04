import Mongoose from "mongoose";
import BaseSchema from "@app/framework/core/BaseSchema";
import ISizeDocument from "@app/app/documents/ISizeDocument";
import DBNameConstant from "@app/framework/constants/DBNameConstant";
import { GasketPTCShape } from "@app/framework/constants/DBEnumConstant";
import { FormType } from "../constants/EnumConstant";

const document = {
    name: {
        require: true,
        type: String,
    },

    inner_diameter: {
        type: Number,
        require: true,
    },

    outer_diameter: {
        type: Number,
        require: true,
    },

    hole_count: {
        type: Number,
        require: true,
    },

    hole_diameter: {
        type: Number,
        require: true,
    },

    material_price: {
        type: Number,
    },

    work_price: {
        type: Number,
    },

    product_type: {
        type: Mongoose.Types.ObjectId,
        require: true,
        ref: DBNameConstant.PRODUCT_TYPE,
    },

    shape_type: {
        type: String,
        enum: GasketPTCShape,
    },

    form_type: {
        type: String,
        enum: FormType,
    },

    coefficient: {
        type: Number,
    }, // only for gasket PTC

    bolt: {
        type: Number,
    }, // only for gasket PTC

    wn: {
        type: Number,
    },

    wt: {
        type: Number,
    },

    ln: {
        type: Number,
    },

    lt: {
        type: Number,
    },

    ir: {
        type: Number,
    },

    or: {
        type: Number,
    },

    bl: {
        type: Number,
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

export default Mongoose.model<ISizeDocument>(DBNameConstant.SIZE, fileschema) as unknown as Mongoose.Model<Mongoose.Document>;
