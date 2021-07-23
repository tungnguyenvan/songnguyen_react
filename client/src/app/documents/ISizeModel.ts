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
    wn: number;
    wt: number;
    ln: number;
    lt: number;
    ir: number;
    or: number;
}

export default ISizeModel;
