import BaseRepository from "@app/framework/core/BaseRepository";
import StandardModel from "@app/app/models/StandardModel";
import AppUtil from "@app/framework/utils/AppUtil";

const NAME_SPACE = "StandardRepository";

/**
 * Standard repository
 * @author tung.nguyenvan
 */
class StandardRepository extends BaseRepository {
    constructor() {
        super(new StandardModel());
    }

    populate(object: any) {
        return AppUtil.populateUpdatedBy(AppUtil.populateCreatedBy(object))
            .populate({
                path: "system_standard",
                select: "_id name",
            })
            .select("-__v");
    }
}

export default StandardRepository;
