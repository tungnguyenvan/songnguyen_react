import IUserLoginContextState from "./IUserLoginContextState";
import IUserLoginContextFunc from "./IUserLoginContextFunc";

interface IUserLoginContext {
  state: IUserLoginContextState;
  current: IUserLoginContextFunc;
}

export default IUserLoginContext;
