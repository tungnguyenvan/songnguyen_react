import BaseRepository from "@app/framework/core/BaseRepository";
import ThicknessModel from "@app/app/models/ThicknessModel";

const NAME_SPACE = "ThicknessRepository";

/**
 * Thickness repository
 * @author tung.nguyenvan
 */
class ThicknessRepository extends BaseRepository {
	constructor() {
		super(new ThicknessModel());
	}
}

export default ThicknessRepository;
