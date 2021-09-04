import axios from "axios";
import RequestPathConstant from "framework/constants/RequestPathConstant";
import IBaseResponse from "framework/documents/response/IBaseResponse";
import IBaseModel from "framework/documents/models/IBaseModel";
import IUpdateDeleteResponseModel from "framework/documents/response/IUpdateDeleteResponseModel";
import IUserModel from "framework/documents/models/IUserModel";

class BaseApiService<T extends IBaseModel> {
    protected requestPathConst: RequestPathConstant;

    constructor(requestPathConst: RequestPathConstant) {
        this.requestPathConst = requestPathConst;
    }

    all(params?: any): Promise<IBaseResponse<T>> {
        if (params) {
            return axios.get(this.requestPathConst, {
                params: {
                    search: params,
                },
            });
        }
        return axios.get(this.requestPathConst);
    }

    get(id: string): Promise<IBaseResponse<T>> {
        return axios.get(this.requestPathConst + id);
    }

    save(body: T): Promise<IBaseResponse<T>> {
        return axios.post(this.requestPathConst, body);
    }

    update(id: string, body: T): Promise<IBaseResponse<T>> {
        body.createdBy = undefined as unknown as IUserModel;
        return axios.put(this.requestPathConst + id, body);
    }

    delete(id: string): Promise<IBaseResponse<IUpdateDeleteResponseModel>> {
        return axios.delete(this.requestPathConst + id);
    }
}

export default BaseApiService;
