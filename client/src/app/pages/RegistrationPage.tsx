import React from "react";
import LanguageContext from "framework/contexts/lang/LanguageContext";
import FrameworkComponents from "framework/components/FrameworkComponents";
import MessageId from "framework/constants/MessageId";
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant";
import InputTextTypeConstant from "framework/constants/InputTextTypeConstant";
import IAppUrlContext from "framework/contexts/url/IAppUrlContext";
import AppUrlContext from "framework/contexts/url/AppUrlContext";
import RouteConstant from "framework/constants/RouteConstant";
import IUserModel from "../../framework/documents/models/IUserModel";
import UserApiService from "../../framework/api/UserApiService";
import HttpRequestStatusCode from "../../framework/constants/HttpRequestStatusCode";
import IAppDialogContext from "../../framework/contexts/dialog/IAppDialogContext";
import AppDialogContext from "../../framework/contexts/dialog/AppDialogContext";
import ILanguageContext from "../../framework/contexts/lang/ILanguageContext";

class RegistrationPage extends React.Component {
	private appUrlContext!: IAppUrlContext;
	private emailRef: React.RefObject<any>;
	private firstNameRef: React.RefObject<any>;
	private lastNameRef: React.RefObject<any>;
	private passwordRef: React.RefObject<any>;
	private confirmPasswordRef: React.RefObject<any>;
	private appDialogContext?: IAppDialogContext;
	private languageContext?: ILanguageContext;

	constructor(props: any) {
		super(props);

		this.emailRef = React.createRef();
		this.firstNameRef = React.createRef();
		this.lastNameRef = React.createRef();
		this.passwordRef = React.createRef();
		this.confirmPasswordRef = React.createRef();

		this.onRegistration = this.onRegistration.bind(this);
		this.validateRegistration = this.validateRegistration.bind(this);
	}

	onRegistration() {
		if (this.validateRegistration()) {
			const userObject: IUserModel = {
				email: this.emailRef.current.getValue(),
				firstName: this.firstNameRef.current.getValue(),
				lastName: this.lastNameRef.current.getValue(),
				password: this.passwordRef.current.getValue(),
			} as IUserModel;

			const userApiService = new UserApiService();
			userApiService
				.registration(userObject)
				.then((response) => {
					if (response.status === HttpRequestStatusCode.CREATED) {
						// TODO: Created new account success
						this.appDialogContext?.addDialog({
							title: this.languageContext?.current.getMessageString(MessageId.REGISTRATION_SUCCESS)!,
							content: this.languageContext?.current.getMessageString(
								MessageId.REGISTRATION_SUCCESS_CONTENT
							)!,
						});

						this.appUrlContext.redirectTo(RouteConstant.LOGIN);
					} else {
						// TODO: Cannot create new account
						this.appDialogContext?.addDialog({
							title: this.languageContext?.current.getMessageString(MessageId.REGISTRATION_FAILED)!,
							content: this.languageContext?.current.getMessageString(
								MessageId.REGISTRATION_FAILED_CONTENT
							)!,
						});
					}
				})
				.catch((error) => {
					if (error.response.status === HttpRequestStatusCode.INTERNAL_SERVER_ERROR) {
						// TODO Cannot create new account
						this.appDialogContext?.addDialog({
							title: this.languageContext?.current.getMessageString(MessageId.SERVER_ERROR)!,
							content: this.languageContext?.current.getMessageString(MessageId.SERVER_ERROR_CONTENT)!,
						});
					} else {
						// TODO: Cannot create new account
						this.appDialogContext?.addDialog({
							title: this.languageContext?.current.getMessageString(MessageId.REGISTRATION_FAILED)!,
							content: this.languageContext?.current.getMessageString(
								MessageId.REGISTRATION_FAILED_CONTENT
							)!,
						});
					}
				});
		}
	}

	validateRegistration(): boolean {
		return true;
	}

	render() {
		return (
			<LanguageContext.Consumer>
				{(languageContext) => (
					<FrameworkComponents.BasePage>
						<AppUrlContext.Consumer>
							{(context) => {
								this.appUrlContext = context;
								return undefined;
							}}
						</AppUrlContext.Consumer>
						<AppDialogContext.Consumer>
							{(context) => {
								this.languageContext = languageContext;
								this.appDialogContext = context;
								return undefined;
							}}
						</AppDialogContext.Consumer>
						<FrameworkComponents.BaseForm
							title={languageContext.current.getMessageString(MessageId.REGISTRATION)}
						>
							<FrameworkComponents.FormGroup>
								<FrameworkComponents.InputText
									ref={this.emailRef}
									placeHolder={languageContext.current.getMessageString(MessageId.EMAIL)}
								/>
							</FrameworkComponents.FormGroup>
							<FrameworkComponents.FormGroup>
								<FrameworkComponents.InputText
									ref={this.firstNameRef}
									placeHolder={languageContext.current.getMessageString(MessageId.FIRST_NAME)}
								/>
								<FrameworkComponents.InputText
									ref={this.lastNameRef}
									placeHolder={languageContext.current.getMessageString(MessageId.LAST_NAME)}
								/>
							</FrameworkComponents.FormGroup>
							<FrameworkComponents.FormGroup>
								<FrameworkComponents.InputText
									ref={this.passwordRef}
									type={InputTextTypeConstant.PASSWORD}
									placeHolder={languageContext.current.getMessageString(MessageId.PASSWORD)}
								/>
								<FrameworkComponents.InputText
									ref={this.confirmPasswordRef}
									type={InputTextTypeConstant.PASSWORD}
									placeHolder={languageContext.current.getMessageString(MessageId.CONFIRM_PASSWORD)}
								/>
							</FrameworkComponents.FormGroup>
							<FrameworkComponents.FormGroup>
								<FrameworkComponents.Button
									type={ButtonTypeConstant.FLAT}
									onClick={() => this.appUrlContext.redirectTo(RouteConstant.LOGIN)}
								>
									{languageContext.current.getMessageString(MessageId.LOGIN)}
								</FrameworkComponents.Button>
								<FrameworkComponents.Button
									type={ButtonTypeConstant.PRIMARY}
									onClick={this.onRegistration}
								>
									{languageContext.current.getMessageString(MessageId.REGISTRATION)}
								</FrameworkComponents.Button>
							</FrameworkComponents.FormGroup>
						</FrameworkComponents.BaseForm>
					</FrameworkComponents.BasePage>
				)}
			</LanguageContext.Consumer>
		);
	}
}

export default RegistrationPage;
