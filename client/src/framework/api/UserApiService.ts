import BaseApiService from "./BaseApiService";
import IBaseResponse from "framework/documents/response/IBaseResponse";
import RequestPathConstant from "framework/constants/RequestPathConstant";
import axios from "axios";
import IUserModel from "../documents/models/IUserModel";

class UserApiService extends BaseApiService<IUserModel> {
    constructor() {
        super(RequestPathConstant.USER);
    }

    login(userLogin: IUserModel): Promise<IBaseResponse<IUserModel>> {
        return axios.post(this.requestPathConst + "login", userLogin);
    }

    registration(userRegistration: IUserModel): Promise<IBaseResponse<IUserModel>> {
        return axios.post(this.requestPathConst, userRegistration);
    }

    me(): Promise<IBaseResponse<IUserModel>> {
        return axios.get(this.requestPathConst + "info/me");
    }
}

export default UserApiService;
