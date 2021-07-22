import IBaseDocument from "@app/framework/interfaces/IBaseDocument";
import Mongoose from "mongoose";

/**
 * Size document
 * @author tung.nguyenvan
 */
interface ISizeDocument extends IBaseDocument {
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
    product_type: Mongoose.Types.ObjectId;
    wn: number;
    wt: number;
    ln: number;
    lt: number;
    ir: number;
    or: number;
}

export default ISizeDocument;
