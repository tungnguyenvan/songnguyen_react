import IUserModel from "framework/documents/models/IUserModel";

interface IUserLoginContextState {
  user: IUserModel;
  callbacks: (() => void)[];
}

export default IUserLoginContextState;
