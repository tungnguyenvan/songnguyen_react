import React from "react";
import NavigationComponent from "framework/components/nav/NavigationComponent";
import NavigationContext from "./NavigationContext";
import INavigationContext from "./INavigationContext";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import NavigationItemComponent from "framework/components/nav/NavigationItemComponent";
import LanguageContext from "framework/contexts/lang/LanguageContext";
import MessageId from "framework/constants/MessageId";

// resources
import { ReactComponent as HomeIcon } from "framework/resources/image/house.svg";
import { ReactComponent as People } from "framework/resources/image/people.svg";
import { ReactComponent as Award } from "framework/resources/image/award.svg";
import { ReactComponent as PersonChecked } from "framework/resources/image/person-check.svg";
import { ReactComponent as App } from "framework/resources/image/app.svg";
import RouteConstant from "framework/constants/RouteConstant";
import UserLoginContext from "../user/UserLoginContext";

interface INavigationProviderProps {
	children?: any;
}

interface INavigationProviderState {
	isActive: Boolean;
}

class NavigationProvider
	extends React.Component<INavigationProviderProps, INavigationProviderState>
	implements INavigationContext
{
	private navigationRef: React.RefObject<any>;
	private refsActiveNavigation: React.RefObject<any>[];

	constructor(props: INavigationProviderProps) {
		super(props);
		this.refsActiveNavigation = [];

		this.navigationRef = React.createRef();

		this.state = {
			isActive: false,
		};

		this.close = this.close.bind(this);
	}

	addRefsActiveNavigation(...refs: React.RefObject<any>[]): void {
		this.refsActiveNavigation.push(...refs);
	}

	componentDidMount() {
		FrameworkUtils.addEventWhenClickOutSideMultipleNode(
			this.close,
			this.navigationRef,
			...this.refsActiveNavigation
		);
	}

	toggle(): void {
		this.setState({
			isActive: !this.state.isActive,
		});
	}

	show(): void {
		this.setState({
			isActive: true,
		});
	}

	close(): void {
		this.setState({
			isActive: false,
		});
	}

	render() {
		return (
			<UserLoginContext.Consumer>
				{(userLoginContext) => (
					<NavigationContext.Provider value={this}>
						<LanguageContext.Consumer>
							{(context) =>
								userLoginContext.current.isLoggedIn() && (
									<NavigationComponent isShow={this.state.isActive} ref={this.navigationRef}>
										<NavigationItemComponent
											icon={<App />}
											title={context.current.getMessageString(MessageId.DASHBOARD)}
											redirectTo={RouteConstant.DASHBOARD}
										/>
										<NavigationItemComponent
											icon={<HomeIcon />}
											title={context.current.getMessageString(MessageId.STORES)}
											redirectTo={RouteConstant.STORES}
										/>
										<NavigationItemComponent
											icon={<People />}
											title={context.current.getMessageString(MessageId.CUSTOMERS)}
											redirectTo={RouteConstant.CUSTOMER}
										/>
										<NavigationItemComponent
											icon={<PersonChecked />}
											title={context.current.getMessageString(MessageId.PARTNERS)}
											redirectTo={RouteConstant.PARTNERS}
										/>
										<NavigationItemComponent
											icon={<Award />}
											title="Example"
											redirectTo={RouteConstant.EXAMPLE}
										/>
										<NavigationItemComponent
											icon={<Award />}
											title="Example"
											redirectTo={RouteConstant.REGISTRATION}
										/>
									</NavigationComponent>
								)
							}
						</LanguageContext.Consumer>
						{this.props.children}
					</NavigationContext.Provider>
				)}
			</UserLoginContext.Consumer>
		);
	}
}

export default NavigationProvider;
