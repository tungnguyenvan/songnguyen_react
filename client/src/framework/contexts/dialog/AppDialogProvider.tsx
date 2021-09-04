import React from "react";
import AppDialogComponent from "../../components/dialog/AppDialogComponent";
import IDialogModel from "../../documents/ui/IDialogModel";
import FrameworkUtils from "../../utils/FrameworkUtils";
import AppDialogContext from "./AppDialogContext";
import IAppDialogContext from "./IAppDialogContext";

interface AppDialogProviderProps {}
interface AppDialogProviderState {
	dialogModelList: IDialogModel[];
}

class AppDialogProvider
	extends React.Component<AppDialogProviderProps, AppDialogProviderState>
	implements IAppDialogContext
{
	constructor(props: AppDialogProviderProps) {
		super(props);

		this.state = {
			dialogModelList: [],
		};

		this.onCloseDialog = this.onCloseDialog.bind(this);
	}

	addDialog(dialogModel: IDialogModel): void {
		setTimeout(() => {
			this.setState({
				dialogModelList: [...this.state.dialogModelList, dialogModel],
			});
		}, 200);
	}

	onCloseDialog(dialogModel?: IDialogModel) {
		if (FrameworkUtils.isAlive(dialogModel)) {
			this.setState({
				dialogModelList: [
					...FrameworkUtils.removeItemInList<IDialogModel>(
						this.state.dialogModelList,
						dialogModel!
					),
				],
			});
		}
	}

	render() {
		return (
			<AppDialogContext.Provider value={this}>
				{this.props.children}
				<AppDialogComponent
					dialogModel={
						this.state.dialogModelList.length ? this.state.dialogModelList[0] : undefined
					}
					onCloseDialog={this.onCloseDialog}
				/>
			</AppDialogContext.Provider>
		);
	}
}

export default AppDialogProvider;
