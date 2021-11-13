import Rule from "framework/documents/models/Rule";
import React from "react";

interface ProductNameFormRef {
    inputName: React.RefObject<any>;
    productTypeOption: React.RefObject<any>;
    inputVolatility?: React.RefObject<any>;
}

interface ProductNameFormValidate {
    inputName: Rule[];
}

// eslint-disable-next-line import/no-anonymous-default-export
export type { ProductNameFormRef, ProductNameFormValidate };
