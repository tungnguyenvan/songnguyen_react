import Mongoose from "mongoose";
import IBaseDocument from "@app/framework/interfaces/IBaseDocument";

interface IStoreDocument extends IBaseDocument {
    /**
     * Name of store
     */
    name: string;

    /**
     * Address of store
     */
    address: Mongoose.Types.ObjectId;

    /**
     * Avatar of store
     */
    avatar: Mongoose.Types.ObjectId;

    /**
     * List member of store
     */
    members: Mongoose.Types.ObjectId[];

    /**
     * List warehouse of store
     */
    warehouses: Mongoose.Types.ObjectId[];
}

export default IStoreDocument;
