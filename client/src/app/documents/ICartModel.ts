import { CartStatus } from "framework/constants/AppEnumConstant";
import IBaseModel from "framework/documents/models/IBaseModel";
import ICartItemModel from "./ICartItemModel";
import ICustomerModel from "./ICustomerModel";

interface ICartModel extends IBaseModel {
    customer: ICustomerModel | string;
    items: ICartItemModel[] | string[];
    status: CartStatus;
}

export default ICartModel;
