import Mongoose from "mongoose";
import IBaseModel from "@app/framework/interfaces/IBaseModel";
import IBaseDocument from "@app/framework/interfaces/IBaseDocument";
import AppUtil from "../utils/AppUtil";
import Logging from "../utils/Logging";

const NAME_SPACE = "BaseModel";

class BaseModel implements IBaseModel {
    protected schema: Mongoose.Model<Mongoose.Document>;

    constructor(schema: Mongoose.Model<Mongoose.Document>) {
        this.schema = schema;
    }

    /**
     * get all record
     * @author tung.nguyenvan
     */
    all(query: any): any {
        return this.schema.find(query);
    }

    /**
     * get one record by id
     * @param id
     * @author tung.nguyenvan
     */
    get(id: Mongoose.Types.ObjectId): any {
        return this.schema.findOne({ _id: id });
    }

    /**
     * save a new record
     * @author tung.nguyenvan
     */
    save(item: IBaseDocument): Promise<Mongoose.Document> {
        return this.schema.create(item);
    }

    delete(id: Mongoose.Types.ObjectId): any {
        return this.schema.deleteOne({
            _id: id,
        });
    }

    /**
     * update one record
     * @param id
     * @param document
     * @author tung.nguyenvan
     */
    updateOne(id: Mongoose.Types.ObjectId, document: IBaseDocument): any {
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#updateOne`, `${id} - ${document}`);
        return this.schema.updateOne(
            {
                _id: id,
            },
            document
        );
    }

    /**
     * Find by query
     * @param document query
     * @author tung.nguyenvan
     */
    find(document: IBaseDocument): any {
        return this.schema.find({
            ...AppUtil.toMap(document),
        });
    }

    /**
     * Check document is exists
     * @param document query document
     * @returns true if exists
     * @author tung.nguyenvan
     */
    exists(document: IBaseDocument): any {
        return this.schema.exists({
            ...AppUtil.toMap(document),
        });
    }
}

export default BaseModel;
