import Rule from "framework/documents/models/Rule";
import React from "react";

interface IEmployeeFormRef {
    email: React.RefObject<any>;
    firstName: React.RefObject<any>;
    lastName: React.RefObject<any>;
    birthDate: React.RefObject<any>;
    phoneNumber: React.RefObject<any>;
    role: React.RefObject<any>;
    password: React.RefObject<any>;
    confirmPassword: React.RefObject<any>;
}

interface IEmployeeFormValidate {
    email: Rule[];
    firstName: Rule[];
    lastName: Rule[];
    birthDate: Rule[];
    phoneNumber: Rule[];
    password: Rule[];
    confirmPassword: Rule[];
}

export type { IEmployeeFormRef, IEmployeeFormValidate };
