import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import Rule from "framework/documents/models/Rule";
import BaseValidation from "framework/utils/BaseValidation";
import React from "react";
import InputText from "./InputText";

class InputTextController {
    private inputRef: React.RefObject<any>;
    private baseFormRef: React.RefObject<any>;
    private languageContext!: ILanguageContext;

    constructor(inputText: InputText) {
        this.inputRef = React.createRef();
        this.baseFormRef = React.createRef();

        this.onFocus = this.onFocus.bind(this);
        this.onChange = this.onChange.bind(this);
        this.getValue = this.getValue.bind(this);
        this.getInputRef = this.getInputRef.bind(this);
        this.getInputRef = this.getInputRef.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.onInputFocus = this.onInputFocus.bind(this);
    }

    setErrorMessage(errorMessage: string): void {
        this.baseFormRef.current.setErrorMessage(errorMessage);
    }

    clear() {
        this.inputRef.current.value = "";
        this.onInputBlur();
    }

    onChange() {
        this.setErrorMessage("");
    }

    getInputRef() {
        return this.inputRef;
    }

    getBaseFormRef() {
        return this.baseFormRef;
    }

    setLanguageContext(languageContext: ILanguageContext) {
        this.languageContext = languageContext;
    }

    onFocus(): void {
        this.inputRef.current.focus();
    }

    getValue(): String | Number {
        return this.inputRef.current ? this.inputRef.current.value : false;
    }

    setValue(value: any) {
        this.inputRef.current.value = value;
    }

    onInputBlur() {
        this.baseFormRef.current?.onBlur();
        this.inputRef.current.blur();
    }

    onInputFocus() {
        this.baseFormRef.current?.onFocus();
    }

    isValid(rules: Rule[]) {
        let isValid = true;
        const baseValidation = new BaseValidation();

        for (const rule of rules) {
            if (!baseValidation.validate(rule, this.getValue())) {
                this.setErrorMessage(this.languageContext.current.getMessageString(rule.getMessageError()));
                isValid = false;
                break;
            }
        }

        return isValid;
    }
}

export default InputTextController;
