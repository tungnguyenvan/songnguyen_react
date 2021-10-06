import Rule from "framework/documents/models/Rule";

interface IProductTypeFormRef {
    inputName: React.RefObject<any>;
    formTypeSelectBox: React.RefObject<any>;
    unit: React.RefObject<any>;
    inputMinAmount: React.RefObject<any>;
}

interface IProductTypeFormValidate {
    inputName: Rule[];
    formTypeSelectBox: Rule[];
    unit: Rule[];
}

export type { IProductTypeFormRef, IProductTypeFormValidate };
