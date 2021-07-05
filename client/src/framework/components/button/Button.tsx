import React from "react";
import ClassName from "classnames";
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant";

// resources
import Style from "framework/resources/css/ButtonComponent.module.scss";

interface IButtonProps {
	children?: any;
	type: ButtonTypeConstant;
	isForTableCell?: Boolean;
	onClick?: () => void;
}

interface IButtonState {}

class Button extends React.Component<IButtonProps, IButtonState> {
	constructor(props: IButtonProps) {
		super(props);
		this.onMiddleButtonClicked = this.onMiddleButtonClicked.bind(this);
	}

	onMiddleButtonClicked() {
		if (this.props.onClick) this.props.onClick!();
	}

	render() {
		const containerStyle = ClassName(Style.framewok__button__container, {
			[Style.primary]: this.props.type === ButtonTypeConstant.PRIMARY,
			[Style.warning]: this.props.type === ButtonTypeConstant.WARNING,
			[Style.danger]: this.props.type === ButtonTypeConstant.DANGER,
			[Style.table__cell]: this.props.isForTableCell
		});

		return (
			<div className={containerStyle} onClick={this.onMiddleButtonClicked}>
				{this.props.children}
			</div>
		);
	}
}

export default Button;
