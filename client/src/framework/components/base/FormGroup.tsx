import React from "react";

// resources
import Style from "framework/resources/css/BaseFormGroup.module.scss";

class FormGroup extends React.Component {
	render() {
		return <div className={Style.base__form__group}>{this.props.children}</div>;
	}
}

export default FormGroup;
