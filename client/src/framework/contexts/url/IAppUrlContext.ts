interface IAppUrlContext {
    redirectTo(url: String): void;
    isCurrentUrl(url: string): boolean;
    canBack(): boolean;
    back(): void;
}

export default IAppUrlContext;
