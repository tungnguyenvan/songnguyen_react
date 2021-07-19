import Rule from "framework/documents/models/Rule";

interface SystemStandardFormRef {
    inputName: React.RefObject<any>;
}

interface SystemStandardFormValidate {
    inputName: Rule[];
}

export type { SystemStandardFormRef, SystemStandardFormValidate };
