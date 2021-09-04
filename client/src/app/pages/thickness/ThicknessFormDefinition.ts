import Rule from "framework/documents/models/Rule";

interface ThicknessFormRef {
    inputName: React.RefObject<any>;
    inputPrice: React.RefObject<any>;
    selectBoxProductName: React.RefObject<any>;
}

interface ThicknessFormValidate {
    inputName: Rule[];
    inputPrice: Rule[];
    selectBoxProductName: Rule[];
}

export type { ThicknessFormRef, ThicknessFormValidate };
