import BaseRepository from "@app/framework/core/BaseRepository";
import SizeModel from "@app/app/models/SizeModel";

const NAME_SPACE = "SizeRepository";

/**
 * Size repository
 * @author tung.nguyenvan
 */
class SizeRepository extends BaseRepository {
	constructor() {
		super(new SizeModel());
	}
}

export default SizeRepository;
