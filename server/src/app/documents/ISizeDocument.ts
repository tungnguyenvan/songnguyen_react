import { GasketPTCShape } from "@app/framework/constants/DBEnumConstant";
import IBaseDocument from "@app/framework/interfaces/IBaseDocument";
import Mongoose from "mongoose";
import { FormType } from "../constants/EnumConstant";

/**
 * Size document
 * @author tung.nguyenvan
 */
interface ISizeDocument extends IBaseDocument {
    system_standard: Mongoose.Types.ObjectId;
    standard: Mongoose.Types.ObjectId;

    /**
     * Size name
     */
    name: string;

    inner_diameter: number;
    outer_diameter: number;
    hole_count: number;
    hole_diameter: number;
    material_price: number;
    work_price: number;
    form_type: FormType;
    product_type: Mongoose.Types.ObjectId;
    shape_type: GasketPTCShape;
    coefficient: number; // only for gasket PTC
    bolt: number; // only for gasket PTC
    wn: number;
    wt: number;
    ln: number;
    lt: number;
    ir: number;
    or: number;
    bl: number;
}

export default ISizeDocument;
