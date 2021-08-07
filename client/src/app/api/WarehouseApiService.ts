import IWarehouseModel from "app/documents/IWarehouseModel";
import BaseApiService from "framework/api/BaseApiService";
import RequestPathConstant from "framework/constants/RequestPathConstant";

class WarehouseApiService extends BaseApiService<IWarehouseModel> {
    constructor() {
        super(RequestPathConstant.WAREHOUSE);
    }
}

export default WarehouseApiService;
