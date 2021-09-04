import React from "react";
import InputText from "framework/components/input/InputText";
import Rule from "framework/documents/models/Rule";

interface ICustomerFormRef {
    name: React.RefObject<InputText>;
    address: React.RefObject<InputText>;
    tax_code: React.RefObject<InputText>;
    email: React.RefObject<InputText>;
    phone_numner: React.RefObject<InputText>;
    contact_name: React.RefObject<InputText>;
}

interface ICustomerFormRule {
    name: Rule[];
    address: Rule[];
    tax_code: Rule[];
    email: Rule[];
    phone_number: Rule[];
    contact_name: Rule[];
}

// eslint-disable-next-line import/no-anonymous-default-export
export type { ICustomerFormRef, ICustomerFormRule };
