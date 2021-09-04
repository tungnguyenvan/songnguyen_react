import IProductNameModel from "app/documents/IProductNameModel";
import BaseApiService from "framework/api/BaseApiService";
import RequestPathConstant from "framework/constants/RequestPathConstant";

class ProductNameApiService extends BaseApiService<IProductNameModel> {
    constructor() {
        super(RequestPathConstant.PRODUCT_NAME);
    }
}

export default ProductNameApiService;
