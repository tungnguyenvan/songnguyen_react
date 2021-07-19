import ISystemStandardModel from "app/documents/ISystemStandardModel";
import BaseApiService from "framework/api/BaseApiService";
import RequestPathConstant from "framework/constants/RequestPathConstant";

class SystemStandardApiService extends BaseApiService<ISystemStandardModel> {
    constructor() {
        super(RequestPathConstant.SYSTEM_STANDARD);
    }
}

export default SystemStandardApiService;
