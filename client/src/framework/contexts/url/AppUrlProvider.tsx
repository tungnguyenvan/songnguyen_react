import React from "react";
import { Redirect, RouteComponentProps, withRouter } from "react-router-dom";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import AppUrlContext from "./AppUrlContext";
import IAppUrlContext from "./IAppUrlContext";
import RouteConstant from "framework/constants/RouteConstant";

interface IAppUrlProviderProps extends RouteComponentProps<any> {
	children?: any;
}

interface IAppUrlProviderState {
	urlRedirectTo: string;
	history: string[]
}

class AppUrlProvider
	extends React.Component<IAppUrlProviderProps, IAppUrlProviderState>
	implements IAppUrlContext
{
	constructor(props: IAppUrlProviderProps) {
		super(props);

		this.state = {
			urlRedirectTo: "",
			history: []
		};

		this.back = this.back.bind(this)
		this.redirectTo = this.redirectTo.bind(this)
		this.isCurrentUrl = this.isCurrentUrl.bind(this)
	}

	redirectTo(url: string): void {
		const history = this.state.history

		if (this.state.urlRedirectTo !== RouteConstant.LOGIN) {
			if (this.state.urlRedirectTo === "") {
				history.push("/")
			} else {
				history.push(this.state.urlRedirectTo)
			}
		}

		this.setState({
			urlRedirectTo: url,
			history: history
		});

		window.scrollTo(0, 0);
	}

	isCurrentUrl(url: string): boolean {
		return this.props.location.pathname === url;
	}

	back(): void {
		const history = this.state.history
		if (history.length > 0) {
			console.log(history)
			let url: string | undefined = history.pop()
			if (!url) url = ''
			console.log(url)
			this.setState({
				urlRedirectTo: url,
				history: history
			})
		}
	}

	canBack(): boolean {
		return this.state.history.length > 0
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
