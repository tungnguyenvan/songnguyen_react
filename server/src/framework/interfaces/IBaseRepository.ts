import Express from "express";
import Mongoose from "mongoose";

export default interface IBaseRepository {
    all(): Promise<Mongoose.Document>;

    get(request: Express.Request): Promise<Mongoose.Document>;

    save(request: Express.Request): Promise<Mongoose.Document>;

    delete(request: Express.Request): Promise<Mongoose.Document>;

    updateOne(request: Express.Request): Promise<Mongoose.Document>;
}
