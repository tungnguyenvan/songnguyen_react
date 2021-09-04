import Mongoose from "mongoose";
import BaseSchema from "@app/framework/core/BaseSchema";
import ITagDocument from "@app/app/documents/ITagDocument";
import DBNameConstant from "@app/framework/constants/DBNameConstant";

const document = {
	name: {
		require: true,
		type: String,
	},

	store: {
		require: true,
		ref: DBNameConstant.STORE,
		type: Mongoose.Types.ObjectId,
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

const fileschema = new Mongoose.Schema(document)
	.pre("save", BaseSchema.preSave)
	.pre("updateOne", BaseSchema.preUpdate);

export default (Mongoose.model<ITagDocument>(
	DBNameConstant.TAG,
	fileschema
) as unknown) as Mongoose.Model<Mongoose.Document>;
