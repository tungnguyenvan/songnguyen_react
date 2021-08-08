import IWarehouseModel from "app/documents/IWarehouseModel";
import axios from "axios";
import BaseApiService from "framework/api/BaseApiService";
import RequestPathConstant from "framework/constants/RequestPathConstant";

class WarehouseApiService extends BaseApiService<IWarehouseModel> {
    constructor() {
        super(RequestPathConstant.WAREHOUSE);

        this.downloadTemplateFile = this.downloadTemplateFile.bind(this);
    }

    downloadTemplateFile() {
        return axios.get(this.requestPathConst + "/download/template");
    }
}

export default WarehouseApiService;
