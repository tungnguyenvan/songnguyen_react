import BaseModel from "@app/framework/core/BaseModel";
import ProductNameSchema from "@app/app/schema/ProductNameSchema";

const NAME_SPACE = "ProductNameModel";

/**
 * ProductName model
 * @author tung.nguyenvan
 */
class ProductNameModel extends BaseModel {
	constructor() {
		super(ProductNameSchema);
	}
}

export default ProductNameModel;
