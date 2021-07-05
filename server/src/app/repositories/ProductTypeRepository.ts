import BaseRepository from "@app/framework/core/BaseRepository";
import ProductTypeModel from "@app/app/models/ProductTypeModel";

/**
 * File repository
 * @author tung.nguyenvan
 */
class ProductTypeRepository extends BaseRepository {
    constructor() {
        super(new ProductTypeModel());
    }
}

export default ProductTypeRepository;
