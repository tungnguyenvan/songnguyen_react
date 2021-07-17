import IBaseModel from "framework/documents/models/IBaseModel";
import IProductNameModel from "./IProductNameModel";

interface IThicknessModel extends IBaseModel {
    name: string;
    price: number;
    product_name: IProductNameModel | string;
}

export default IThicknessModel;
