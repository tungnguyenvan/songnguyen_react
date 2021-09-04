interface IFormInputElement {
    isValid(): boolean;
    setErrorMessage(errorMessage: string): void;
    getValue(): any;
    isChanged(): boolean;
    clear(): void;
}

export default IFormInputElement;
