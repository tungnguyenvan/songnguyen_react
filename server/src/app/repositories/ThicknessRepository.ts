import BaseRepository from "@app/framework/core/BaseRepository";
import ThicknessModel from "@app/app/models/ThicknessModel";
import AppUtil from "@app/framework/utils/AppUtil";

const NAME_SPACE = "ThicknessRepository";

/**
 * Thickness repository
 * @author tung.nguyenvan
 */
class ThicknessRepository extends BaseRepository {
    constructor() {
        super(new ThicknessModel());
    }

    populate(object: any) {
        return AppUtil.populateUpdatedBy(AppUtil.populateCreatedBy(object))
            .populate({
                path: "product_name",
                select: "_id name",
            })
            .select("-__v");
    }
}

export default ThicknessRepository;
