import React from "react";
import ClassName from "classnames";
import IDialogModel from "framework/documents/ui/IDialogModel";
import Style from "framework/resources/css/AppDialogComponent.module.scss";
import FrameworkComponents from "framework/components/FrameworkComponents";
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant";
import FrameworkUtils from "framework/utils/FrameworkUtils";

interface AppDialogComponentProps {
	dialogModel?: IDialogModel;
	onCloseDialog: (dialogModel?: IDialogModel) => void;
}

class AppDialogComponent extends React.Component<AppDialogComponentProps> {
	render() {
		const dialogContainerClass = ClassName(Style.dialog__container, {
			[Style.active]: FrameworkUtils.isAlive(this.props.dialogModel),
		});

		return (
			<div className={dialogContainerClass}>
				<div className={Style.dialog__surface}>
					<h2 className={Style.dialog__title}>{this.props.dialogModel?.title}</h2>
					<div className={Style.dialog__content}>{this.props.dialogModel?.content}</div>
					<div className={Style.dialog__actions}>
						<FrameworkComponents.Button
							type={ButtonTypeConstant.FLAT}
							onClick={() => {
								this.props.onCloseDialog(this.props.dialogModel);
							}}
						>
							Cancel
						</FrameworkComponents.Button>
						<FrameworkComponents.Button type={ButtonTypeConstant.PRIMARY}>
							Primary action
						</FrameworkComponents.Button>
					</div>
				</div>
			</div>
		);
	}
}

export default AppDialogComponent;
