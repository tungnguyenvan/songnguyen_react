interface IAppLoadingContext {
	addRequest(url: string | undefined): void;
	removeRequest(url: string | undefined): void;
}

export default IAppLoadingContext;
