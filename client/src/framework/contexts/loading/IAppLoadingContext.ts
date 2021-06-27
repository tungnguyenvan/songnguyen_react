import IAppLoadingContextFunc from "./IAppLoadingContextFunc";

interface IAppLoadingContext {
	isRequesting: boolean;
	current: IAppLoadingContextFunc;
}

export default IAppLoadingContext;
