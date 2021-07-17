import IBaseModel from "framework/documents/models/IBaseModel";
import IProductTypeModel from "./IProductTypeModel";

interface IProductNameModel extends IBaseModel {
    name: string;
    product_type: IProductTypeModel[] | string[];
}

export default IProductNameModel;
