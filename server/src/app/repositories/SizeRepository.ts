import BaseRepository from "@app/framework/core/BaseRepository";
import SizeModel from "@app/app/models/SizeModel";
import AppUtil from "@app/framework/utils/AppUtil";

const NAME_SPACE = "SizeRepository";

/**
 * Size repository
 * @author tung.nguyenvan
 */
class SizeRepository extends BaseRepository {
    constructor() {
        super(new SizeModel());
    }

    populate(object: any) {
        return AppUtil.populateUpdatedBy(AppUtil.populateCreatedBy(object))
            .populate({
                path: "product_type",
                select: "_id name form_type",
            })
            .select("-__v");
    }
}

export default SizeRepository;
