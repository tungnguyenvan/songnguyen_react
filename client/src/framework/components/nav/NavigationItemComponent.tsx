import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import ClassName from "classnames";
import AppUrlContext from "framework/contexts/url/AppUrlContext";
import IAppUrlContext from "framework/contexts/url/IAppUrlContext";
import INavigationContext from "framework/contexts/nav/INavigationContext";

// resources
import Style from "framework/resources/css/NavigationComponent.module.scss";
import NavigationContext from "../../contexts/nav/NavigationContext";

interface INavigationItemContainerProps extends RouteComponentProps<any> {
	icon: React.SVGProps<SVGSVGElement>;
	title: string;
	redirectTo: string;
}

interface INavigationItemContainerState {}

class NavigationItemComponent extends React.Component<
	INavigationItemContainerProps,
	INavigationItemContainerState
> {
	private appUrlContext: IAppUrlContext | undefined;
	private navigationContext: INavigationContext | undefined;

	constructor(props: INavigationItemContainerProps) {
		super(props);

		// binding
		this.onRedirectNav = this.onRedirectNav.bind(this);
	}

	onRedirectNav() {
		if (this.props.location.pathname !== this.props.redirectTo) {
			this.appUrlContext!.redirectTo(this.props.redirectTo);
		}
		this.navigationContext!.close();
	}

	render() {
		const containerClassname = ClassName(Style.navigation__item__container, {
			[Style.navigation__item__active]: this.props.redirectTo === this.props.location.pathname,
		});

		return (
			<li className={containerClassname} onClick={this.onRedirectNav}>
				<AppUrlContext.Consumer>
					{(context) => {
						this.appUrlContext = context;
						return undefined;
					}}
				</AppUrlContext.Consumer>
				<NavigationContext.Consumer>
					{(context) => {
						this.navigationContext = context;
						return undefined;
					}}
				</NavigationContext.Consumer>
				<div className={Style.navigation__item__icon}>{this.props.icon}</div>
				<div className={Style.navigation__item__title}>
					<h5>{this.props.title}</h5>
				</div>
			</li>
		);
	}
}

export default withRouter(NavigationItemComponent);
