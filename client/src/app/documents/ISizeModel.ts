import { FormType, GasketPTCShape } from "framework/constants/AppEnumConstant";
import IBaseModel from "framework/documents/models/IBaseModel";
import IProductTypeModel from "./IProductTypeModel";

interface ISizeModel extends IBaseModel {
    name: string;
    inner_diameter: number;
    outer_diameter: number;
    hole_count: number;
    hole_diameter: number;
    material_price: number;
    work_price: number;
    product_type: IProductTypeModel | string;
    form_type: FormType;
    shape_type: GasketPTCShape; // only for gasket PTC
    coefficient: number; // only for gasket PTC
    bolt: number; // only for gasket PTC
    wn: number; // only for gasket PTC
    wt: number; // only for gasket PTC
    ln: number; // only for gasket PTC
    lt: number; // only for gasket PTC
    ir: number; // only for gasket PTC
    or: number; // only for gasket PTC
    bl: number; // only for gasket PTC
}

export default ISizeModel;
