import BaseRepository from "@app/framework/core/BaseRepository";
import SystemStandardModel from "@app/app/models/SystemStandardModel";
import AppUtil from "@app/framework/utils/AppUtil";

const NAME_SPACE = "SystemStandardRepository";

/**
 * SystemStandard repository
 * @author tung.nguyenvan
 */
class SystemStandardRepository extends BaseRepository {
    constructor() {
        super(new SystemStandardModel());
    }

    populate(object: any) {
        return AppUtil.populateUpdatedBy(AppUtil.populateCreatedBy(object)).select("-__v");
    }
}

export default SystemStandardRepository;
