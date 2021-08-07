import BaseRepository from "@app/framework/core/BaseRepository";
import WarehouseModel from "@app/app/models/WarehouseModel";
import AppUtil from "@app/framework/utils/AppUtil";

const NAME_SPACE = "WarehouseRepository";

/**
 * Warehouse repository
 * @author tung.nguyenvan
 */
class WarehouseRepository extends BaseRepository {
    constructor() {
        super(new WarehouseModel());
    }

    populate(object: any) {
        return AppUtil.populateUpdatedBy(AppUtil.populateCreatedBy(object))
            .populate({
                path: "product_name",
                select: "-__v",
            })
            .populate({
                path: "product_type",
                select: "-__v",
            })
            .populate({
                path: "thickness",
                select: "-__v",
            })
            .populate({
                path: "system_standard",
                select: "-__v",
            })
            .populate({
                path: "standard",
                select: "-__v",
            })
            .populate({
                path: "size",
                select: "-__v",
            })
            .select("-__v");
    }
}

export default WarehouseRepository;
