import IDialogModel from "./IDialogModel";

interface ITableCellModel {
    id: string;
    content: string[];
    action?: {
        edit?: {
            isAlive: boolean;
            dialog?: IDialogModel;
            func: (id: string) => void;
        };

        delete?: {
            isAlive: boolean;
            dialog?: IDialogModel;
            func: (id: string) => void;
        };
    };
}

export default ITableCellModel;
