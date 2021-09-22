import Express from "express";
import AppUtil from "@app/framework/utils/AppUtil";
import Logging from "@app/framework/utils/Logging";
import IUserDocument from "@app/app/documents/IUserDocument";
import BaseController from "@app/framework/core/BaseController";
import UserRepository from "@app/app/repositories/UserRepository";
import { UserRole, UserStatus } from "@app/framework/constants/DBEnumConstant";
import IBaseModel from "@app/framework/interfaces/IBaseModel";

const NAME_SPACE = "UserController";

class UserController extends BaseController {
    constructor() {
        super(new UserRepository());

        // binding
        this.me = this.me.bind(this);
        this.login = this.login.bind(this);
        this.middlewareUpdateUser = this.middlewareUpdateUser.bind(this);
        this.prepareSaveUserInformation = this.prepareSaveUserInformation.bind(this);
        this.changePassword = this.changePassword.bind(this);
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

    async login(request: Express.Request, response: Express.Response) {
        try {
            (this.repository as UserRepository)
                .login(request)
                .then((loginResult) => {
                    Logging.success(NAME_SPACE, `${NAME_SPACE}#login`, loginResult);

                    if (AppUtil.isObject(loginResult)) {
                        AppUtil.bcryptCompare(request.body.password, loginResult.password, (err: any, res: any) => {
                            Logging.debug(NAME_SPACE, `${NAME_SPACE}#Login|bcryptCompare ${err}`);
                            Logging.debug(NAME_SPACE, `${NAME_SPACE}#Login|bcryptCompare ${res} | ${request.body.password} | ${loginResult.password}`);
                            if (err) {
                                return this.appResponse.notFound(request, response);
                            }

                            if (!res) {
                                this.appResponse.notFound(request, response);
                            } else {
                                loginResult.password = undefined;

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
                            }
                        });
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

    changePassword(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {
        try {
            Logging.debug(NAME_SPACE, `${NAME_SPACE}#changePassword START`);
            (this.repository as UserRepository).middlewareChangePassword(request).then((findResponse) => {
                if (findResponse._id) {
                    AppUtil.bcryptCompare(request.body.current_password, findResponse.password, (err: any, res: any) => {
                        if (err || !res) {
                            this.appResponse.notFound(request, response);
                        } else {
                            AppUtil.endcodePassword(request.body.current_password)
                                .then((newPasswordEncrypt) => {
                                    request.body.password = newPasswordEncrypt;
                                    this.repository
                                        .updateOne(request)
                                        .then((updateResponse) => {
                                            this.appResponse.ok(request, response, updateResponse);
                                        })
                                        .catch((error) => {
                                            Logging.error(NAME_SPACE, `${NAME_SPACE}#changePassword`, error);
                                            this.appResponse.internalServerError(request, response);
                                        });
                                })
                                .catch((error) => {
                                    Logging.error(NAME_SPACE, `${NAME_SPACE}#prepareSaveUserInformation endcodePassword`, error);

                                    this.appResponse.internalServerError(request, response);
                                });
                        }
                    });
                }
            });
        } finally {
            Logging.debug(NAME_SPACE, `${NAME_SPACE}#changePassword END`);
        }
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
        Logging.debug(NAME_SPACE, `${NAME_SPACE}#middlewareUpdateUser START`, request.userinformation);
        (this.repository as UserRepository)
            .middlewareUpdateUser(request)
            .then((userResponse) => {
                // if (AppUtil.isObject(userResponse) && !AppUtil.isArray(userResponse)) {
                Logging.info(NAME_SPACE, `${NAME_SPACE}#middlewareUpdateUser`, userResponse);
                if ((request.userinformation as IUserDocument).role === UserRole.ADMIN || request.userinformation._id === request.params.id) {
                    next();
                } else {
                    this.appResponse.notFound(request, response);
                }
                // } else {
                //     this.appResponse.notFound(request, response);
                // }
            })
            .catch((error) => {
                Logging.error(NAME_SPACE, `${NAME_SPACE}#middlewareUpdateUser`, error);
            });
    }
}

export default UserController;
