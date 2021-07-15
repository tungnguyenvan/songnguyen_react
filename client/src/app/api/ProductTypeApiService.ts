import IProductTypeModel from "app/documents/IProductTypeModel";
import BaseApiService from "framework/api/BaseApiService";
import RequestPathConstant from "framework/constants/RequestPathConstant";

class ProductTypeApiService extends BaseApiService<IProductTypeModel> {
    constructor() {
        super(RequestPathConstant.PRODUCT_TYPE);
    }
}

export default ProductTypeApiService;
