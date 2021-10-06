import IBaseModel from "framework/documents/models/IBaseModel";
import IProductNameModel from "./IProductNameModel";
import IProductTypeModel from "./IProductTypeModel";
import ISizeModel from "./ISizeModel";
import IStandardModel from "./IStandardModel";
import ISystemStandardModel from "./ISystemStandardModel";
import IThicknessModel from "./IThicknessModel";

interface IWarehouseModel extends IBaseModel {
    product_name: string | IProductNameModel;
    product_type: string | IProductTypeModel;
    thickness: string | IThicknessModel;
    system_standard: string | ISystemStandardModel;
    standard: string | IStandardModel;
    size: string | ISizeModel;
    amount: number;
    price: number;
}

export default IWarehouseModel;
