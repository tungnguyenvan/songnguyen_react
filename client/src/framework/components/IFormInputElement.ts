interface IFromInputElement {
    isValid(): boolean;
    setErrorMessage(errorMessage: string): void;
    getValue(): any;
    isChanged(): boolean;
    clear(): void;
}

export default IFromInputElement;
