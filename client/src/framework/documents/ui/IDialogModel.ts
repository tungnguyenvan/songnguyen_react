interface IDialogModel {
    title: string;
    content: string;
    action?: () => void;
}

export default IDialogModel;
