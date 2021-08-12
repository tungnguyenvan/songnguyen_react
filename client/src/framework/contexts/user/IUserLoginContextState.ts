import IUserModel from "framework/documents/models/IUserModel";

interface IUserLoginContextState {
    user: IUserModel;
    callbacks: (() => void)[];
    logoutCallbacks: (() => void)[];
}

export default IUserLoginContextState;
