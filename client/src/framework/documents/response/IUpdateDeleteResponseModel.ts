import IBaseModel from "../models/IBaseModel";

interface IUpdateDeleteResponseModel extends IBaseModel {
    n: number;
    ok: number;
    deleteCount: number;
}

export default IUpdateDeleteResponseModel;
