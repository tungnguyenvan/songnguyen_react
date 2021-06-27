import React from "react";
import FrameworkComponents from "framework/components/FrameworkComponents";
import LanguageContext from "framework/contexts/lang/LanguageContext";
import MessageId from "framework/constants/MessageId";

class CustomersPage extends React.Component {
	render() {
		return (
			<LanguageContext.Consumer>
				{(context) => (
					<FrameworkComponents.BasePage
						title={context.current.getMessageString(MessageId.CUSTOMERS)}
					></FrameworkComponents.BasePage>
				)}
			</LanguageContext.Consumer>
		);
	}
}

export default CustomersPage;
