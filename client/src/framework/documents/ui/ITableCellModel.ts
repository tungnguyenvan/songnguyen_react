import { TableRowColor } from "framework/constants/AppEnumConstant";
import IDialogModel from "./IDialogModel";

interface ITableCellModel {
    id: string;
    content: string[];
    color?: TableRowColor;
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

        choose?: {
            isAlive: boolean;
            dialog?: IDialogModel;
            func: (id: string) => void;
        };
    };
}

export default ITableCellModel;
