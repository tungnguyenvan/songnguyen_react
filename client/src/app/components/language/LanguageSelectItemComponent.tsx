import React from "react";

import Style from "app/resources/css/LanguageSelectComponent.module.scss";
import LanguageModel from "framework/documents/models/LanguageModel";

interface LanguageSelectItemComponentProps {
	language: LanguageModel;
	onSelected: (lang: LanguageModel) => void;
}

class LanguageSelectItemComponent extends React.Component<LanguageSelectItemComponentProps> {
	render() {
		return (
			<div
				className={Style.language__select__item__component}
				onClick={() => this.props.onSelected(this.props.language)}
			>
				<div className={Style.language__select__flag}>{this.props.language.flag}</div>
				<div className={Style.language__select__name}>{this.props.language.name}</div>
			</div>
		);
	}
}

export default LanguageSelectItemComponent;
