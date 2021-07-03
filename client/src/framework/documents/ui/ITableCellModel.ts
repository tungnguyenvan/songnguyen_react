interface ITableCellModel {
    id: string;
    content: string[];
    action?: {
        edit?: {
            isAlive: boolean;
            func: (id: string) => void;
        };

        delete?: {
            isAlive: boolean;
            func: (id: string) => void;
        };
    };
}

export default ITableCellModel;
