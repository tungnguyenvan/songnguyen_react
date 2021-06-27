import React from "react";
import InputText from "./InputText";

class InputTextController {
	private inputRef: React.RefObject<any>;
	private baseFormRef: React.RefObject<any>;

	constructor(inputText: InputText) {
		this.inputRef = React.createRef();
		this.baseFormRef = React.createRef();

		this.onFocus = this.onFocus.bind(this);
		this.getValue = this.getValue.bind(this);
		this.getInputRef = this.getInputRef.bind(this);
		this.getInputRef = this.getInputRef.bind(this);
		this.onInputBlur = this.onInputBlur.bind(this);
		this.onInputFocus = this.onInputFocus.bind(this);
	}

	setErrorMessage(errorMessage: string): void {
		this.baseFormRef.current.setErrorMessage(errorMessage);
	}

	getInputRef() {
		return this.inputRef;
	}

	getBaseFormRef() {
		return this.baseFormRef;
	}

	onFocus(): void {
		this.inputRef.current.focus();
	}

	getValue(): String | Number {
		return this.inputRef.current.value;
	}

	onInputBlur() {
		this.baseFormRef.current?.onBlur();
	}

	onInputFocus() {
		this.baseFormRef.current?.onFocus();
	}
}

export default InputTextController;
