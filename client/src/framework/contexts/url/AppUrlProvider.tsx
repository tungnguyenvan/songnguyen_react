import React from "react";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import AppUrlContext from "./AppUrlContext";
import IAppUrlContext from "./IAppUrlContext";

interface IAppUrlProviderProps extends RouteComponentProps<any> {
	children?: any;
}

interface IAppUrlProviderState {
	urlRedirectTo: string;
}

class AppUrlProvider
	extends React.Component<IAppUrlProviderProps, IAppUrlProviderState>
	implements IAppUrlContext
{
	constructor(props: IAppUrlProviderProps) {
		super(props);

		this.state = {
			urlRedirectTo: "",
		};
	}

	redirectTo(url: string): void {
		this.setState({
			urlRedirectTo: url,
		});
	}

	isCurrentUrl(url: string): boolean {
		return this.props.location.pathname === url;
	}

	render() {
		return (
			<AppUrlContext.Provider value={this}>
				{this.props.children}
				{this.state.urlRedirectTo &&
					!FrameworkUtils.isBlank(this.state.urlRedirectTo) &&
					FrameworkUtils.currentPath() !== this.state.urlRedirectTo && (
						<Redirect to={this.state.urlRedirectTo} />
					)}
			</AppUrlContext.Provider>
		);
	}
}

export default withRouter(AppUrlProvider);
