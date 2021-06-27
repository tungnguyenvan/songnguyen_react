import React from "react";
import NavigationProvider from "framework/contexts/nav/NavigationContext";
import INavigationContext from "framework/contexts/nav/INavigationContext";
import LanguageSelectComponent from "app/components/language/LanguageSelectComponent";
import HorizontalLoadingComponent from "framework/components/loading/HorizontalLoadingComponent";
import AppLoadingContext from "framework/contexts/loading/AppLoadingContext";

// resources
import Style from "app/resources/css/HeaderComponent.module.scss";
import { ReactComponent as HamburgerIcon } from "app/resources/image/list.svg";

interface IHeaderComponentProps {}
interface IHeaderComponentState {
	isActiveLoadingBar: boolean;
}

class HeaderComponent extends React.Component<IHeaderComponentProps, IHeaderComponentState> {
	private navigationContext: INavigationContext | undefined;
	private hamburgerDivRef: React.RefObject<any>;

	constructor(props: any) {
		super(props);

		this.state = {
			isActiveLoadingBar: false,
		};

		this.hamburgerDivRef = React.createRef();
	}

	render() {
		return (
			<div className={Style.app__header}>
				<div className={Style.app__header__content}>
					<div className={Style.app__header__flex__left}>
						<div
							className={Style.app__header__hamburger__button}
							onClick={() => {
								this.navigationContext!.toggle();
							}}
							ref={this.hamburgerDivRef}
						>
							<NavigationProvider.Consumer>
								{(context) => {
									context.addRefsActiveNavigation(this.hamburgerDivRef);
									this.navigationContext = context;
									return undefined;
								}}
							</NavigationProvider.Consumer>
							<HamburgerIcon />
						</div>
					</div>
					<div className={Style.app__header__flex__center}></div>
					<div className={Style.app__header__flex__right}>
						<LanguageSelectComponent />
						{/* <StoreSelectComponent /> */}
					</div>
				</div>
				<div className={Style.app__header__process}>
					<AppLoadingContext.Consumer>
						{(context) => <HorizontalLoadingComponent isActive={context.isRequesting} />}
					</AppLoadingContext.Consumer>
				</div>
			</div>
		);
	}
}

export default HeaderComponent;
