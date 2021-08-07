import React from "react";
import InputTextController from "./InputTextController";
import BaseFormControl from "framework/components/base/BaseFormControl";
import Rule from "framework/documents/models/Rule";
import IFormInputElement from "../IFormInputElement";
import LanguageContext from "framework/contexts/lang/LanguageContext";

interface IInputTextProps {
	placeHolder: string;
	type?: string;
	value?: string | number;
	readOnly?: boolean;
	validate?: Rule[]
	onChange?: () => void
}

interface IInputTextState {
}

class InputText extends React.Component<IInputTextProps, IInputTextState> implements IFormInputElement {
	private inputTextController: InputTextController;

	constructor(props: IInputTextProps) {
		super(props);
		this.inputTextController = new InputTextController(this);

		this.onChange = this.onChange.bind(this)
		this.onFocus = this.onFocus.bind(this)
	}

	isChanged(): boolean {
		return this.props.value !== this.getValue()
	}

	clear(): void {
		this.inputTextController.clear()
	}

	componentDidMount() {
		if (this.props.value) {
			this.inputTextController.onInputFocus()
			this.inputTextController.onInputBlur()
		}
	}

	componentDidUpdate() {
		if (this.props.value) {
			this.inputTextController.onInputFocus()
			this.inputTextController.onInputBlur()
		}
	}

	getValue(): String | Number {
		return this.inputTextController.getValue();
	}

	setErrorMessage(errorMessage: string): void {
		this.inputTextController.setErrorMessage(errorMessage);
	}

	isValid(): boolean {
		if (this.props.readOnly) return true

		if (this.props.validate) {
			return this.inputTextController.isValid(this.props.validate)
		}
		return true
	}

	onFocus() {
		this.inputTextController.onFocus()
	}

	onChange() {
		if (this.props.onChange) {
			this.props.onChange()
		}
		this.inputTextController.onChange()
	}

	setValue(value: any) {
		this.inputTextController.setValue(value)
	}

	render() {
		return (
			<BaseFormControl
				ref={this.inputTextController.getBaseFormRef()}
				placeHolder={this.props.placeHolder}
				onFocusCallback={this.inputTextController.onFocus}
				getValue={this.inputTextController.getValue}
				disable={this.props.readOnly}
			>
				<input
					ref={this.inputTextController.getInputRef()}
					type={this.props.type}
					onBlur={this.inputTextController.onInputBlur}
					onFocus={this.inputTextController.onInputFocus}
					onChange={this.onChange}
					defaultValue={this.props.value}
					readOnly={this.props.readOnly}
				/>
				<LanguageContext.Consumer>{
					context => {
						this.inputTextController.setLanguageContext(context)
						return undefined
					}}</LanguageContext.Consumer>
			</BaseFormControl>
		);
	}
}

export default InputText;
