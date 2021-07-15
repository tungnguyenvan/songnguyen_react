import React from "react";
import FrameworkComponents from "framework/components/FrameworkComponents";

class DashboardPage extends React.Component {
	render() {
		return <FrameworkComponents.BasePage {...{title: "Dashboard"}}></FrameworkComponents.BasePage>;
	}
}

export default DashboardPage;
