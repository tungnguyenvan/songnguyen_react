import IThicknessModel from "app/documents/IThicknessModel";
import BaseApiService from "framework/api/BaseApiService";
import RequestPathConstant from "framework/constants/RequestPathConstant";

class ThicknessApiService extends BaseApiService<IThicknessModel> {
    constructor() {
        super(RequestPathConstant.THICKNESS);
    }
}

export default ThicknessApiService;
