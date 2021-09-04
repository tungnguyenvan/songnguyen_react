import BaseRepository from "@app/framework/core/BaseRepository";
import ProductTypeModel from "@app/app/models/ProductTypeModel";
import AppUtil from "@app/framework/utils/AppUtil";

/**
 * File repository
 * @author tung.nguyenvan
 */
class ProductTypeRepository extends BaseRepository {
    constructor() {
        super(new ProductTypeModel());
    }

    populate(object: any) {
        return AppUtil.populateUpdatedBy(AppUtil.populateCreatedBy(object)).select("-__v");
    }
}

export default ProductTypeRepository;
