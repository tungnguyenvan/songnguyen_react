import React from "react";
import FrameworkUtils from "../../utils/FrameworkUtils";
import AppLoadingContext from "./AppLoadingContext";
import IAppLoadingContextFunc from "./IAppLoadingContextFunc";

interface AppLoadingProviderProps {}
interface AppLoadingProviderState {
	requestUrls: string[];
}

class AppLoadingProvider
	extends React.Component<AppLoadingProviderProps, AppLoadingProviderState>
	implements IAppLoadingContextFunc
{
	constructor(props: AppLoadingProviderProps) {
		super(props);

		this.state = {
			requestUrls: [],
		};
	}

	addRequest(url: string | undefined): void {
		if (FrameworkUtils.isAlive(url)) {
			this.setState({
				requestUrls: [...this.state.requestUrls, String(url)],
			});
		}
	}

	removeRequest(url: string): void {
		if (FrameworkUtils.isAlive(url)) {
			const index = this.state.requestUrls.indexOf(url);
			const urlList = this.state.requestUrls;
			urlList.splice(index);
			this.setState({
				requestUrls: urlList,
			});
		}
	}
	render() {
		return (
			<AppLoadingContext.Provider
				value={{
					isRequesting: this.state.requestUrls.length !== 0,
					current: this,
				}}
			>
				{this.props.children}
			</AppLoadingContext.Provider>
		);
	}
}

export default AppLoadingProvider;
