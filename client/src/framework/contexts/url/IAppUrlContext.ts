interface IAppUrlContext {
	redirectTo(url: String): void;
	isCurrentUrl(url: string): boolean;
}

export default IAppUrlContext;
