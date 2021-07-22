import Rule from "framework/documents/models/Rule";

interface IProductTypeFormRef {
    inputName: React.RefObject<any>;
    formTypeSelectBox: React.RefObject<any>;
}

interface IProductTypeFormValidate {
    inputName: Rule[];
    formTypeSelectBox: Rule[];
}

export type { IProductTypeFormRef, IProductTypeFormValidate };
