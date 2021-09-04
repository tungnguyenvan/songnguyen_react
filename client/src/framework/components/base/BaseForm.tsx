import React from "react";
import classNames from "classnames";

// resources
import Style from "framework/resources/css/BaseForm.module.scss";

interface IBaseFormProps {
	children?: any;
	title?: String;
	small?: boolean
}

interface IBaseFormState {}

class BaseForm extends React.Component<IBaseFormProps, IBaseFormState> {
	render() {
		return (
			<form className={classNames(Style.base__form, {[Style.small]: this.props.small})}>
				<h2>{this.props.title}</h2>
				{this.props.children}
			</form>
		);
	}
}

export default BaseForm;
