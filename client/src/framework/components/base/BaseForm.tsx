import React from "react";

// resources
import Style from "framework/resources/css/BaseForm.module.scss";

interface IBaseFormProps {
	children?: any;
	title?: String;
}

interface IBaseFormState {}

class BaseForm extends React.Component<IBaseFormProps, IBaseFormState> {
	render() {
		return (
			<form className={Style.base__form}>
				<h2>{this.props.title}</h2>
				{this.props.children}
			</form>
		);
	}
}

export default BaseForm;
