import IUserModel from "framework/documents/models/IUserModel";

interface IUserLoginContextFunc {
    setUser(user: IUserModel): void;
    isLoggedIn(): boolean;
    addEventUserLogin(callback: () => void): void;
    removeUserLoggedIn(): void;
}

export default IUserLoginContextFunc;
