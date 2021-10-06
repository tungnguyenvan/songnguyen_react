import { FormType } from "framework/constants/AppEnumConstant";
import IBaseModel from "framework/documents/models/IBaseModel";

interface IProductTypeModel extends IBaseModel {
    name: string;
    form_type: FormType;
    unit: string;
    min_amount: number;
}

export default IProductTypeModel;
