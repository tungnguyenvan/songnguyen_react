import Express from "express";
import AppUtil from "@app/framework/utils/AppUtil";
import Logging from "@app/framework/utils/Logging";
import IUserDocument from "@app/app/documents/IUserDocument";
import BaseController from "@app/framework/core/BaseController";
import UserRepository from "@app/app/repositories/UserRepository";
import { UserStatus } from "@app/framework/constants/DBEnumConstant";

const NAME_SPACE = "UserController";

class UserController extends BaseController {
    constructor() {
        super(new UserRepository());

        // binding
        this.me = this.me.bind(this);
        this.login = this.login.bind(this);
        this.middlewareUpdateUser = this.middlewareUpdateUser.bind(this);
        this.prepareSaveUserInformation = this.prepareSaveUserInformation.bind(this);
    }

    public me(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#me START`);

        (this.repository as UserRepository)
            .me(request)
            .then((data) => {
                this.appResponse.ok(request, response, data);
            })
            .catch((error) => {
                this.appResponse.notFound(request, response);
            });

        Logging.debug(NAME_SPACE, `${NAME_SPACE}#me END`);
    }

    /**
     * Prepare user information before registration user account
     * @param request Express.Request
     * @param response Express.Response
     * @param next Express.NextFunction
     */
    public prepareSaveUserInformation(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#prepareSaveUserInformation START`);

        // endcoding user password
        AppUtil.endcodePassword(request.body.password)
            .then((passwordEncrypt) => {
                const userId = AppUtil.newObjectId();

                // generate token
                const jsonwebToken: string = AppUtil.generateToken({
                    id: userId,
                    email: request.body.email,
                    status: UserStatus.JUST_CREATED,
                    phoneNumber: request.body.phoneNumber,
                });

                // Password encrypt success
                const userDocument: IUserDocument = {
                    _id: userId,
                    token: jsonwebToken,
                    email: request.body.email,
                    birthDate: request.body.birthDate,
                    password: passwordEncrypt,
                    lastName: request.body.lastName,
                    firstName: request.body.firstName,
                    phoneNumber: request.body.phoneNumber,
                } as IUserDocument;

                // set data for request
                request.body = userDocument;

                next();
            })
            .catch((error) => {
                Logging.error(NAME_SPACE, `${NAME_SPACE}#prepareSaveUserInformation endcodePassword`, error);

                this.appResponse.internalServerError(request, response);
            });
    }

    login(request: Express.Request, response: Express.Response) {
        try {
            (this.repository as UserRepository)
                .login(request)
                .then((loginResult) => {
                    Logging.success(NAME_SPACE, `${NAME_SPACE}#login`, loginResult);

                    if (AppUtil.isObject(loginResult)) {
                        // generate token
                        const token = AppUtil.generateToken({
                            _id: loginResult._id,
                            email: loginResult.email,
                            role: loginResult.role,
                            status: loginResult.status,
                        });

                        this.updateToken(loginResult._id, token);

                        // set token
                        loginResult.token = token;

                        this.appResponse.ok(request, response, loginResult);
                    } else {
                        // login failed
                        this.appResponse.notFound(request, response);
                    }
                })
                .catch((error) => {
                    Logging.error(NAME_SPACE, `${NAME_SPACE}#login`, error);
                    this.catchError(request, response, error);
                });
        } catch (error: any) {
            Logging.error(NAME_SPACE, `${NAME_SPACE}#login`, error);
            this.catchError(request, response, error);
        }
    }

    updateToken(id: string, token: string) {
        (this.repository as UserRepository).updateToken(id, token);
    }

    endcodingRequestPassword(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {
        if (AppUtil.isAlive(request.body.password)) {
            AppUtil.endcodePassword(request.body.password)
                .then((passEndcode) => {
                    request.body.password = passEndcode;
                    next();
                })
                .catch((error) => {
                    Logging.error(NAME_SPACE, `${NAME_SPACE}#endcodingRequestPassword`, error);
                });
        } else {
            next();
        }
    }

    middlewareUpdateUser(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#middlewareUpdateUser START`);
        (this.repository as UserRepository)
            .middlewareUpdateUser(request)
            .then((userResponse) => {
                if (AppUtil.isObject(userResponse) && !AppUtil.isArray(userResponse) && request.userinformation._id === request.params.id) {
                    next();
                } else {
                    this.appResponse.notFound(request, response);
                }
            })
            .catch((error) => {
                Logging.error(NAME_SPACE, `${NAME_SPACE}#middlewareUpdateUser`, error);
            });
    }
}

export default UserController;
