import Express from "express";
import Mongoose from "mongoose";
import IBaseRepository from "@app/framework/interfaces/IBaseRepository";
import BaseModel from "@app/framework/core/BaseModel";
import IBaseDocument from "@app/framework/interfaces/IBaseDocument";
import Logging from "../utils/Logging";

const NAME_SPACE = "BaseRepository";

export default class BaseRepository implements IBaseRepository {
    protected model: BaseModel;

    constructor(model: BaseModel) {
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#constructor START`);
        this.model = model;
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#constructor END`);
    }

    all(request: Express.Request): Promise<Mongoose.Document> {
        try {
            if (request.query.search) {
                return this.populate(this.model.all(JSON.parse(request.query.search.toString())));
            } else {
                return this.populate(this.model.all({}));
            }
        } finally {
            Logging.debug(NAME_SPACE, `${NAME_SPACE}#all END`);
        }
    }

    get(request: Express.Request): Promise<Mongoose.Document> {
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#get START`);
        try {
            return this.populate(this.model.get(Mongoose.Types.ObjectId(request.params.id)));
        } finally {
            Logging.debug(NAME_SPACE, `${NAME_SPACE}#get END`);
        }
    }

    save(request: Express.Request): Promise<Mongoose.Document> {
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#save START`);
        try {
            return this.model.save(request.body as IBaseDocument);
        } finally {
            Logging.debug(NAME_SPACE, `${NAME_SPACE}#save END`);
        }
    }

    delete(request: Express.Request): Promise<Mongoose.Document> {
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#delete START`);
        try {
            return this.model.delete(Mongoose.Types.ObjectId(request.params.id));
        } finally {
            Logging.debug(NAME_SPACE, `${NAME_SPACE}#delete END`);
        }
    }

    updateOne(request: Express.Request): Promise<Mongoose.Document> {
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#updateOne START`);
        try {
            return this.populate(this.model.updateOne(Mongoose.Types.ObjectId(request.params.id), request.body as IBaseDocument));
        } finally {
            Logging.debug(NAME_SPACE, `${NAME_SPACE}#updateOne END`);
        }
    }

    populate(object: any): any {
        return object;
    }
}
