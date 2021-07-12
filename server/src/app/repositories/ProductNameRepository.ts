import BaseRepository from "@app/framework/core/BaseRepository";
import ProductNameModel from "@app/app/models/ProductNameModel";

const NAME_SPACE = "ProductNameRepository";

/**
 * ProductName repository
 * @author tung.nguyenvan
 */
class ProductNameRepository extends BaseRepository {
	constructor() {
		super(new ProductNameModel());
	}
}

export default ProductNameRepository;
