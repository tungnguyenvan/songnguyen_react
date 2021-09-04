import Express from "express";
import Mongoose from "mongoose";
import BaseRepository from "@app/framework/core/BaseRepository";
import TagModel from "@app/app/models/TagModel";
import ITagDocument from "../documents/ITagDocument";

const NAME_SPACE = "TagRepository";

/**
 * Tag repository
 * @author tung.nguyenvan
 */
class TagRepository extends BaseRepository {
	constructor() {
		super(new TagModel());

		this.middlewareIsExist = this.middlewareIsExist.bind(this);
	}

	middlewareIsExist(request: Express.Request) {
		const document = {
			name: request.body.name,
			store: Mongoose.Types.ObjectId(request.body.store),
		} as ITagDocument;

		return this.model.exists(document);
	}
}

export default TagRepository;
