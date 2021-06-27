import BaseRepository from "@app/framework/core/BaseRepository";
import StoreModel from "@app/app/models/StoreModel";

/**
 * File repository
 * @author tung.nguyenvan
 */
class StoreRepository extends BaseRepository {
	constructor() {
		super(new StoreModel());

		this.populate = this.populate.bind(this);
	}

	populate(object: any) {
		return object
			.populate({
				path: "avatar",
				select: "-__v",
			})
			.select("-__v");
	}
}

export default StoreRepository;
