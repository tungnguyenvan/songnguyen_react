import React from "react";

// resources
import Style from "framework/resources/css/BasePage.module.scss";
import { ReactComponent as ArrowLeftShort} from "framework/resources/image/arrow-left-short.svg";
import WithFramework from "framework/constants/WithFramework";
import IAppUrlContext from "framework/contexts/url/IAppUrlContext";

interface IBasePageProps {
	title?: string;
	appUrlContext: IAppUrlContext,
	disableBackButton?: boolean
}

class BasePage extends React.Component<IBasePageProps> {
	render() {
		return (
			<div className={Style.base__page}>
				<div className={Style.base__page__header}>
					{ (this.props.appUrlContext.canBack() && !this.props.disableBackButton) && <ArrowLeftShort className={Style.back__button} onClick={() => {
						this.props.appUrlContext.back()
					}} />}
					<h2 className={Style.page__title}>{this.props.title}</h2>
				</div>
				{this.props.children}
			</div>
		);
	}
}

export default WithFramework.withAppUrl(BasePage)