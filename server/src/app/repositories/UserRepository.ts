import Express from "express";
import BaseRepository from "@app/framework/core/BaseRepository";
import UserModel from "@app/app/models/UserModel";
import Logging from "@app/framework/utils/Logging";
import IUserDocument from "../documents/IUserDocument";
import Mongoose from "mongoose";
import AppUtil from "@app/framework/utils/AppUtil";

const NAME_SPACE = "UserRepository";

/**
 * User repository
 * @author tung.nguyenvan
 */
class UserRepository extends BaseRepository {
    constructor() {
        super(new UserModel());
    }

    me(request: Express.Request): Promise<any> {
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#me START`);
        try {
            return this.populate(this.model.get(request.userinformation._id));
        } finally {
            Logging.debug(NAME_SPACE, `${NAME_SPACE}#me END`);
        }
    }

    login(request: Express.Request): Promise<any> {
        try {
            Logging.debug(NAME_SPACE, `${NAME_SPACE}#login START`);

            const loginRequest: IUserDocument = {
                email: request.body.email,
                password: request.body.password,
            } as IUserDocument;

            return (this.model as UserModel).login(loginRequest);
        } finally {
            Logging.debug(NAME_SPACE, `${NAME_SPACE}#login END`);
        }
    }

    middlewareUpdateUser(request: Express.Request): Promise<any> {
        try {
            Logging.debug(NAME_SPACE, `${NAME_SPACE}#middlewareUpdateUser START`);

            return this.populate(this.model.get(Mongoose.Types.ObjectId(request.userinformation._id)));
        } finally {
            Logging.debug(NAME_SPACE, `${NAME_SPACE}#middlewareUpdateUser END`);
        }
    }

    middlewareChangePassword(request: Express.Request): Promise<any> {
        try {
            Logging.debug(NAME_SPACE, `${NAME_SPACE}#middlewareChangePassword START`);
            return this.model.get(Mongoose.Types.ObjectId(request.params.id));
        } finally {
            Logging.debug(NAME_SPACE, `${NAME_SPACE}#middlewareChangePassword END`);
        }
    }

    changePassword(request: Express.Request): Promise<any> {
        try {
            Logging.debug(NAME_SPACE, `${NAME_SPACE}#changePassword START`);
            return this.model.updateOne(Mongoose.Types.ObjectId(request.params.id), {
                password: request.body.password,
            } as IUserDocument);
        } finally {
            Logging.debug(NAME_SPACE, `${NAME_SPACE}#changePassword END`);
        }
    }

    updateToken(id: string, token: string) {
        (this.model as UserModel).updateToken(id, token);
    }

    populate(object: any): any {
        return AppUtil.populateUpdatedBy(AppUtil.populateCreatedBy(object)).select("-password -token -__v");
    }
}

export default UserRepository;
