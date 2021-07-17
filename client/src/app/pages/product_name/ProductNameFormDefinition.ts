import Rule from "framework/documents/models/Rule";

interface ProductNameFormRef {
    inputName: React.RefObject<any>;
    productTypeOption: React.RefObject<any>;
}

interface ProductNameFormValidate {
    inputName: Rule[];
}

// eslint-disable-next-line import/no-anonymous-default-export
export type { ProductNameFormRef, ProductNameFormValidate };
