import IBaseModel from "framework/documents/models/IBaseModel";
import ISystemStandardModel from "./ISystemStandardModel";

interface IStandardModel extends IBaseModel {
    name: string;
    system_standard: ISystemStandardModel | string;
    coefficient: number;
    bolt: number;
}

export default IStandardModel;
