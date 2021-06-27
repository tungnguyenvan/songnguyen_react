import React from "react";

// resources
import Style from "framework/resources/css/BasePage.module.scss";

interface IBasePageProps {
	children?: any;
	title?: string;
}

class BasePage extends React.Component<IBasePageProps> {
	render() {
		return (
			<div className={Style.base__page}>
				<h2 className={Style.page__title}>{this.props.title}</h2>
				{this.props.children}
			</div>
		);
	}
}

export default BasePage;
