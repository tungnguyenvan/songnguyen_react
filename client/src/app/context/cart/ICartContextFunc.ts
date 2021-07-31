import ICartModel from "app/documents/ICartModel";

interface ICartContextFunc {
    onRefresh(): void;
    getIdCartSelected(): string;
    getCurrentCart(): ICartModel;
}

export default ICartContextFunc;
