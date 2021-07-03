import ICustomerModel from "app/documents/ICustomerModel";
import BaseApiService from "framework/api/BaseApiService";
import RequestPathConstant from "framework/constants/RequestPathConstant";

class CustomerApiService extends BaseApiService<ICustomerModel> {
    constructor() {
        super(RequestPathConstant.CUSTOMER);
    }
}

export default CustomerApiService;
