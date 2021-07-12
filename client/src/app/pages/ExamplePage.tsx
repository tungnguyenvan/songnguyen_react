import React from "react";
import FrameworkComponents from "framework/components/FrameworkComponents";
import AppDialogContext from "../../framework/contexts/dialog/AppDialogContext";
import ButtonTypeConstant from "../../framework/constants/ButtonTypeConstant";

class ExamplePage extends React.Component {
	render() {
		return (
			<FrameworkComponents.BasePage title="Example page">
				<FrameworkComponents.BaseForm title="Example form">
					<FrameworkComponents.FormGroup>
						<FrameworkComponents.InputText placeHolder="This is place holder" />
						<FrameworkComponents.InputText placeHolder="This is place holder" />
					</FrameworkComponents.FormGroup>
					<FrameworkComponents.FormGroup>
						<FrameworkComponents.InputText placeHolder="This is place holder" />
						<FrameworkComponents.InputText type="password" placeHolder="This is place holder" />
					</FrameworkComponents.FormGroup>
					<FrameworkComponents.FormGroup>
						<FrameworkComponents.SelectBox placeHolder="select this" options={[{id: '1', title: 'jsjsjsj'}, {id: '2', title: 'asasasaas'}]}/>
					</FrameworkComponents.FormGroup>
					<FrameworkComponents.FormGroup>
						<AppDialogContext.Consumer>
							{(context) => (
								<FrameworkComponents.Button
									type={ButtonTypeConstant.PRIMARY}
									onClick={() => {
										context.addDialog({
											title: "Example dialog",
											content: "This is content of example dialog",
										});
									}}
								>
									Add dialog
								</FrameworkComponents.Button>
							)}
						</AppDialogContext.Consumer>
					</FrameworkComponents.FormGroup>
				</FrameworkComponents.BaseForm>
			</FrameworkComponents.BasePage>
		);
	}
}

export default ExamplePage;
