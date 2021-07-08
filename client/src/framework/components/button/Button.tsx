import React from "react";
import ClassName from "classnames";
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant";
import AppDialogContext from "framework/contexts/dialog/AppDialogContext";

// resources
import Style from "framework/resources/css/ButtonComponent.module.scss";
import IDialogModel from "framework/documents/ui/IDialogModel";
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext";

interface IButtonProps {
	children?: any;
	type: ButtonTypeConstant;
	isForTableCell?: Boolean;
	onClick?: () => void;
	disable?: boolean;
	dialogModel?: IDialogModel
}

interface IButtonState {}

class Button extends React.Component<IButtonProps, IButtonState> {
	private appDialogContext!: IAppDialogContext;

	constructor(props: IButtonProps) {
		super(props);
		this.onMiddleButtonClicked = this.onMiddleButtonClicked.bind(this);
	}

	onMiddleButtonClicked() {
		if (this.props.onClick && !this.props.disable) {
			if (this.props.dialogModel) {
				this.appDialogContext.addDialog({
					title: this.props.dialogModel.title,
					content: this.props.dialogModel.content,
					action: this.props.onClick
				})
			} else {
				this.props.onClick!();
			}
		}
	}

	render() {
		const containerStyle = ClassName(Style.framewok__button__container, {
			[Style.disable]: this.props.disable,
			[Style.primary]: this.props.type === ButtonTypeConstant.PRIMARY,
			[Style.warning]: this.props.type === ButtonTypeConstant.WARNING,
			[Style.danger]: this.props.type === ButtonTypeConstant.DANGER,
			[Style.table__cell]: this.props.isForTableCell
		});

		return (
			<div className={containerStyle} onClick={this.onMiddleButtonClicked}>
				<AppDialogContext.Consumer>
					{(context: IAppDialogContext) => {
						this.appDialogContext = context
						return this.props.children
					}}
				</AppDialogContext.Consumer>
			</div>
		);
	}
}

export default Button;
