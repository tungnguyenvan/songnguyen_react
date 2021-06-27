import BaseController from "@app/framework/core/BaseController";
import ProductTypeRepository from "@app/app/repositories/ProductTypeRepository";

const NAME_SPACE = "ProductTypeController";

class ProductTypeController extends BaseController {
	constructor() {
		super(new ProductTypeRepository());
	}
}

export default ProductTypeController;
