import { CartItemSource, CartItemStatus, DiscountType } from "framework/constants/AppEnumConstant";
import IBaseModel from "framework/documents/models/IBaseModel";
import IProductNameModel from "./IProductNameModel";
import IProductTypeModel from "./IProductTypeModel";
import ISizeModel from "./ISizeModel";
import IStandardModel from "./IStandardModel";
import ISystemStandardModel from "./ISystemStandardModel";
import IThicknessModel from "./IThicknessModel";

interface ICartItemModel extends IBaseModel {
    product_name: IProductNameModel | string;
    product_type: IProductTypeModel | string;
    thickness: IThicknessModel | string;
    system_standard: ISystemStandardModel | string;
    standard: IStandardModel | string;
    size: ISizeModel | string;
    amount: number;
    unit_price: number;
    total_price: number;
    discount_type: DiscountType;
    discount_percent: number;
    status: CartItemStatus;
    delivered: number;
    source: CartItemSource;
}

export default ICartItemModel;
