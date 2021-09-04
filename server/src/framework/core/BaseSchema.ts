import Mongoose from "mongoose";
import IBaseDocument from "@app/framework/interfaces/IBaseDocument";
import Logging from "@app/framework/utils/Logging";

const NAME_SPACE = "BASE_SCHEMA";

function preSave(
	this: IBaseDocument,
	next: (err?: Mongoose.NativeError) => void
) {
	Logging.debug(NAME_SPACE, "preSave START");

	const now = Date.now();
	this.updatedAt = now;
	this.createdAt = now;
	this.deletedAt = undefined;

	Logging.debug(NAME_SPACE, "preSave END");
	next();
}

function preUpdate(
	this: IBaseDocument,
	next: (err?: Mongoose.NativeError) => void
) {
	Logging.debug(NAME_SPACE, "preUpdate START");

	const now = Date.now();
	this.update({updatedAt: now});

	Logging.debug(NAME_SPACE, "preUpdate END");
	next();
}

class BaseSchema {
	static preSave: (
		this: IBaseDocument,
		next: (err?: Mongoose.NativeError) => void
	) => void = preSave;

	static preUpdate: (
		this: IBaseDocument,
		next: (err?: Mongoose.NativeError) => void
	) => void = preUpdate;
}

export default BaseSchema;
