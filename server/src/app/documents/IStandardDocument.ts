import IBaseDocument from "@app/framework/interfaces/IBaseDocument";
import Mongoose from "mongoose";

/**
 * Standard document
 * @author tung.nguyenvan
 */
interface IStandardDocument extends IBaseDocument {
    /**
     * Standard name
     */
    name: string;

    system_standard: Mongoose.Types.ObjectId;

    coefficient: number;

    bolt: number;
}

export default IStandardDocument;
