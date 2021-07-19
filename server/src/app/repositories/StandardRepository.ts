import BaseRepository from "@app/framework/core/BaseRepository";
import StandardModel from "@app/app/models/StandardModel";

const NAME_SPACE = "StandardRepository";

/**
 * Standard repository
 * @author tung.nguyenvan
 */
class StandardRepository extends BaseRepository {
	constructor() {
		super(new StandardModel());
	}
}

export default StandardRepository;
