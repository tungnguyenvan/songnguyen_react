import React from "react";
import InputTextController from "./InputTextController";
import BaseFormControl from "framework/components/base/BaseFormControl";

interface IInputTextProps {
	placeHolder: string;
	type?: string;
}

interface IInputTextState {}

class InputText extends React.Component<IInputTextProps, IInputTextState> {
	private inputTextController: InputTextController;

	constructor(props: IInputTextProps) {
		super(props);
		this.inputTextController = new InputTextController(this);
	}

	getValue(): String | Number {
		return this.inputTextController.getValue();
	}

	setErrorMessage(errorMessage: string): void {
		this.inputTextController.setErrorMessage(errorMessage);
	}

	render() {
		return (
			<BaseFormControl
				ref={this.inputTextController.getBaseFormRef()}
				placeHolder={this.props.placeHolder}
				onFocusCallback={this.inputTextController.onFocus}
				getValue={this.inputTextController.getValue}
			>
				<input
					ref={this.inputTextController.getInputRef()}
					type={this.props.type}
					onBlur={this.inputTextController.onInputBlur}
					onFocus={this.inputTextController.onInputFocus}
				/>
			</BaseFormControl>
		);
	}
}

export default InputText;
