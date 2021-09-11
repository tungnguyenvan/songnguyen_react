interface IAppUrlContext {
    redirectTo(url: String): void;
    isCurrentUrl(url: string): boolean;
    canBack(): boolean;
    back(): void;
    addCallback(callback: () => void): void;
}

export default IAppUrlContext;
