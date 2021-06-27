import IDialogModel from "framework/documents/ui/IDialogModel";

interface IAppDialogContext {
	addDialog(dialogModel: IDialogModel): void;
}

export default IAppDialogContext;
