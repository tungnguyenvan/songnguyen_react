import BaseRepository from "@app/framework/core/BaseRepository";
import ProductNameModel from "@app/app/models/ProductNameModel";
import AppUtil from "@app/framework/utils/AppUtil";

const NAME_SPACE = "ProductNameRepository";

/**
 * ProductName repository
 * @author tung.nguyenvan
 */
class ProductNameRepository extends BaseRepository {
    constructor() {
        super(new ProductNameModel());
    }

    populate(object: any) {
        return AppUtil.populateUpdatedBy(AppUtil.populateCreatedBy(object))
            .populate({
                path: "product_type",
                select: "_id name",
            })
            .select("-__v");
    }
}

export default ProductNameRepository;
