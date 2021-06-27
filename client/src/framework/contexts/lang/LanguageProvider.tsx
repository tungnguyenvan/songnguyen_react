import React from "react";
import LanguageConstant from "framework/constants/LanguageConstant";
import LanguageContext from "./LanguageContext";
import MessageId from "framework/constants/MessageId";
import AppMessage from "framework/constants/AppMessage";
import ILanguageContextFunc from "./ILanguageContextFunc";

interface ILanguageProviderProps {
	children?: any;
}

interface ILanguageProviderState {
	currentLanguage: LanguageConstant;
}

class LanguageProvider
	extends React.Component<ILanguageProviderProps, ILanguageProviderState>
	implements ILanguageContextFunc
{
	constructor(props: ILanguageProviderProps) {
		super(props);

		this.state = {
			currentLanguage: LanguageConstant.EN,
		};

		this.changeLanguage = this.changeLanguage.bind(this);
	}

	getMessageString(messageId: MessageId): string {
		return AppMessage.getMessageString(this.state.currentLanguage, messageId);
	}

	changeLanguage(lang: LanguageConstant): void {
		this.setState({
			currentLanguage: lang,
		});
	}

	render() {
		return (
			<LanguageContext.Provider
				value={{
					currentLanguage: this.state.currentLanguage,
					current: this,
				}}>
				{this.props.children}
			</LanguageContext.Provider>
		);
	}
}

export default LanguageProvider;
