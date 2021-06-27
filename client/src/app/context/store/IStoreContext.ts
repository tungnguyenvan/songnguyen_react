import IStoreModel from "app/documents/IStoreModel";
import IStoreContextFunc from "./IStoreContextFunc";

interface IStoreContext {
    storeSelected: IStoreModel;
    current: IStoreContextFunc;
}

export default IStoreContext;
