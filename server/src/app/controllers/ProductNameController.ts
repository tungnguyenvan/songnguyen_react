import BaseController from "@app/framework/core/BaseController";
import ProductNameRepository from "@app/app/repositories/ProductNameRepository";

const NAME_SPACE = "ProductNameController";

/**
 * ProductName Controller
 * @author tung.nguyenvan
 */
class ProductNameController extends BaseController {
	constructor() {
		super(new ProductNameRepository());
	}
}

export default ProductNameController;
