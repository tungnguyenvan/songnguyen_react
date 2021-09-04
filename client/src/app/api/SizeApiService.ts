import ISizeModel from "app/documents/ISizeModel";
import BaseApiService from "framework/api/BaseApiService";
import RequestPathConstant from "framework/constants/RequestPathConstant";

class SizeApiService extends BaseApiService<ISizeModel> {
    constructor() {
        super(RequestPathConstant.SIZE);
    }
}

export default SizeApiService;
