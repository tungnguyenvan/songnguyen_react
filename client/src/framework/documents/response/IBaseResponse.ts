import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode";
import IBaseModel from "../models/IBaseModel";

interface IBaseResponse<T extends IBaseModel> {
    data: {
        link: string;
        request_at: number;
        data: T | T[];
        total?: number;
    };
    status: HttpRequestStatusCode;
}

export default IBaseResponse;
