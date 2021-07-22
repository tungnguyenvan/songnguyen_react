import { FormType } from "framework/constants/AppEnumConstant";
import IBaseModel from "framework/documents/models/IBaseModel";

interface IProductTypeModel extends IBaseModel {
    name: string;
    form_type: FormType;
}

export default IProductTypeModel;
