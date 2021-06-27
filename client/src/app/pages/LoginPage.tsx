import React from "react";
import FrameworkComponents from "framework/components/FrameworkComponents";
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant";
import UserApiService from "framework/api/UserApiService";
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode";
import AppMessage from "framework/constants/AppMessage";
import LanguageConstant from "framework/constants/LanguageConstant";
import MessageId from "framework/constants/MessageId";
import IUserModel from "framework/documents/models/IUserModel";
import IBaseResponse from "framework/documents/response/IBaseResponse";
import LanguageContext from "framework/contexts/lang/LanguageContext";
import IUserLoginContext from "framework/contexts/user/IUserLoginContext";
import UserLoginContext from "framework/contexts/user/UserLoginContext";
import InputTextTypeConstant from "framework/constants/InputTextTypeConstant";
import AppUrlContext from "framework/contexts/url/AppUrlContext";
import IAppUrlContext from "framework/contexts/url/IAppUrlContext";
import RouteConstant from "framework/constants/RouteConstant";
import FrameworkUtils from "../../framework/utils/FrameworkUtils";

class LoginPage extends React.Component {
	private userApiService: UserApiService;
	private emailInputRef: React.RefObject<any>;
	private passwordInputRef: React.RefObject<any>;
	private userLoginContext!: IUserLoginContext;
	private appUrlContext!: IAppUrlContext;

	constructor(props: any) {
		super(props);

		this.emailInputRef = React.createRef();
		this.passwordInputRef = React.createRef();

		this.userApiService = new UserApiService();

		this.onLogin = this.onLogin.bind(this);
	}

	onLogin() {
		const userRequest: IUserModel = {
			email: FrameworkUtils.lowerCaseString(this.emailInputRef.current.getValue()),
			password: this.passwordInputRef.current.getValue(),
		} as unknown as IUserModel;

		this.userApiService
			.login(userRequest)
			.then((response: IBaseResponse<IUserModel>) => {
				if (response.status === HttpRequestStatusCode.OK) {
					this.userLoginContext.current.setUser(response.data.data as IUserModel);
				}
			})
			.catch((error) => {
				if (error.response && error.response.status === HttpRequestStatusCode.NOT_FOUND) {
					this.emailInputRef.current.setErrorMessage(
						AppMessage.getMessageString(LanguageConstant.VI, MessageId.LOGIN_FAILED)
					);
					this.passwordInputRef.current.setErrorMessage(
						AppMessage.getMessageString(LanguageConstant.VI, MessageId.LOGIN_FAILED)
					);
				}
			});
	}

	render() {
		return (
			<LanguageContext.Consumer>
				{(context) => (
					<FrameworkComponents.BasePage>
						<UserLoginContext.Consumer>
							{(context) => {
								this.userLoginContext = context;
								return undefined;
							}}
						</UserLoginContext.Consumer>
						<AppUrlContext.Consumer>
							{(context) => {
								this.appUrlContext = context;
								return undefined;
							}}
						</AppUrlContext.Consumer>
						<FrameworkComponents.BaseForm title={context.current.getMessageString(MessageId.LOGIN)}>
							<FrameworkComponents.FormGroup>
								<FrameworkComponents.InputText
									placeHolder={context.current.getMessageString(MessageId.EMAIL)}
									ref={this.emailInputRef}
								/>
							</FrameworkComponents.FormGroup>
							<FrameworkComponents.FormGroup>
								<FrameworkComponents.InputText
									placeHolder={context.current.getMessageString(MessageId.PASSWORD)}
									type={InputTextTypeConstant.PASSWORD}
									ref={this.passwordInputRef}
								/>
							</FrameworkComponents.FormGroup>
							<FrameworkComponents.FormGroup>
								<FrameworkComponents.Button
									type={ButtonTypeConstant.FLAT}
									onClick={() => this.appUrlContext.redirectTo(RouteConstant.REGISTRATION)}
								>
									{context.current.getMessageString(MessageId.REGISTRATION_REDIRECT)}
								</FrameworkComponents.Button>
								<FrameworkComponents.Button
									type={ButtonTypeConstant.PRIMARY}
									onClick={this.onLogin}
								>
									{context.current.getMessageString(MessageId.LOGIN)}
								</FrameworkComponents.Button>
							</FrameworkComponents.FormGroup>
						</FrameworkComponents.BaseForm>
					</FrameworkComponents.BasePage>
				)}
			</LanguageContext.Consumer>
		);
	}
}

export default LoginPage;
