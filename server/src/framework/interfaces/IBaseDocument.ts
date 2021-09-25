import Mongoose from "mongoose";

interface IBaseDocument extends Mongoose.Document {
    /**
     * ID of record
     */
    _id: Mongoose.Types.ObjectId;

    /**
     * Date created
     */
    createdAt: number;

    /**
     * User id created this record
     */
    createdBy: Mongoose.Types.ObjectId;

    /**
     * Date updated
     */
    updatedAt: number;

    /**
     * User id Updated this record
     */
    updatedBy: Mongoose.Types.ObjectId;

    /**
     * Date deleted
     */
    deletedAt: number;

    /**
     * User id deleted this record
     */
    deleteBy: Mongoose.Types.ObjectId;
}

export default IBaseDocument;
