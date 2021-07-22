import IStandardModel from "app/documents/IStandardModel";
import BaseApiService from "framework/api/BaseApiService";
import RequestPathConstant from "framework/constants/RequestPathConstant";

class StandardApiService extends BaseApiService<IStandardModel> {
    constructor() {
        super(RequestPathConstant.STANDARD);
    }
}

export default StandardApiService;
