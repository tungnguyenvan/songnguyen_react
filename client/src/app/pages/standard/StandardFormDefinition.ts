import Rule from "framework/documents/models/Rule";

interface IStandardFormRef {
    inputName: React.RefObject<any>;
    selectBoxSystemStandard: React.RefObject<any>;
    inputCoefficient: React.RefObject<any>;
    inputBolt: React.RefObject<any>;
}

interface IStandardFormValidate {
    inputName: Rule[];
    selectBoxSystemStandard: Rule[];
    inputCoefficient: Rule[];
    inputBolt: Rule[];
}

export type { IStandardFormRef, IStandardFormValidate };
