import IStoreModel from "app/documents/IStoreModel";

interface IStoreContextFunc {
    onSetStoreSelected(store: IStoreModel): void;
}

export default IStoreContextFunc;
