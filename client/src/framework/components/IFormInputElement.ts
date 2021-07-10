interface IFromInputElement {
    isValid(): boolean;
    setErrorMessage(errorMessage: string): void;
    getValue(): String | Number;
    isChanged(): boolean;
    clear(): void;
}

export default IFromInputElement;
