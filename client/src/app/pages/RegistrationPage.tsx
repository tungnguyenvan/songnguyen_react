import React from "react";
import FrameworkComponents from "framework/components/FrameworkComponents";
import MessageId from "framework/constants/MessageId";
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant";
import InputTextTypeConstant from "framework/constants/InputTextTypeConstant";
import IAppUrlContext from "framework/contexts/url/IAppUrlContext";
import RouteConstant from "framework/constants/RouteConstant";
import IUserModel from "framework/documents/models/IUserModel";
import UserApiService from "framework/api/UserApiService";
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode";
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import WithFramework from "framework/constants/WithFramework";
import IUserLoginContext from "framework/contexts/user/IUserLoginContext";
import { UserRole } from "framework/constants/UserEnumConstant";

interface RegistrationPageProps {
    userLoginContext: IUserLoginContext;
    appUrlContext: IAppUrlContext;
    appDialogContext: IAppDialogContext;
    languageContext: ILanguageContext;
}

class RegistrationPage extends React.Component<RegistrationPageProps> {
    private emailRef: React.RefObject<any>;
    private firstNameRef: React.RefObject<any>;
    private lastNameRef: React.RefObject<any>;
    private passwordRef: React.RefObject<any>;
    private confirmPasswordRef: React.RefObject<any>;

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

    componentDidMount() {
        // check login status
        if (!this.props.userLoginContext.current.isLoggedIn()) {
        	this.props.appUrlContext.redirectTo(RouteConstant.LOGIN)
        }

        // check is admin account
        // eslint-disable-next-line eqeqeq
        if (this.props.userLoginContext.state.user && this.props.userLoginContext.state.user.role != UserRole.ADMIN) {
			console.log(this.props.userLoginContext.state.user.role as UserRole)
            // TODO: change the content and title of dialog
            this.props.appDialogContext.addDialog({
                title: "Error",
                content: "You cannot redirect to this url",
            });

            this.props.appUrlContext.redirectTo(RouteConstant.DASHBOARD);
        }
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
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS)!,
                            content: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS_CONTENT)!,
                        });

                        this.props.appUrlContext.redirectTo(RouteConstant.LOGIN);
                    } else {
                        // TODO: Cannot create new account
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_FAILED)!,
                            content: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_FAILED_CONTENT)!,
                        });
                    }
                })
                .catch((error) => {
                    if (error.response.status === HttpRequestStatusCode.INTERNAL_SERVER_ERROR) {
                        // TODO Cannot create new account
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.SERVER_ERROR)!,
                            content: this.props.languageContext.current.getMessageString(MessageId.SERVER_ERROR_CONTENT)!,
                        });
                    } else {
                        // TODO: Cannot create new account
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_FAILED)!,
                            content: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_FAILED_CONTENT)!,
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
            <FrameworkComponents.BasePage>
                <FrameworkComponents.BaseForm title={this.props.languageContext.current.getMessageString(MessageId.REGISTRATION)}>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.InputText ref={this.emailRef} placeHolder={this.props.languageContext.current.getMessageString(MessageId.EMAIL)} />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.InputText ref={this.firstNameRef} placeHolder={this.props.languageContext.current.getMessageString(MessageId.FIRST_NAME)} />
                        <FrameworkComponents.InputText ref={this.lastNameRef} placeHolder={this.props.languageContext.current.getMessageString(MessageId.LAST_NAME)} />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.InputText ref={this.passwordRef} type={InputTextTypeConstant.PASSWORD} placeHolder={this.props.languageContext.current.getMessageString(MessageId.PASSWORD)} />
                        <FrameworkComponents.InputText ref={this.confirmPasswordRef} type={InputTextTypeConstant.PASSWORD} placeHolder={this.props.languageContext.current.getMessageString(MessageId.CONFIRM_PASSWORD)} />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.Button type={ButtonTypeConstant.PRIMARY} onClick={this.onRegistration}>
                            {this.props.languageContext.current.getMessageString(MessageId.REGISTRATION)}
                        </FrameworkComponents.Button>
                    </FrameworkComponents.FormGroup>
                </FrameworkComponents.BaseForm>
            </FrameworkComponents.BasePage>
        );
    }
}

export default WithFramework.withAppUrl(
    WithFramework.withAppDialog(
        WithFramework.withLanguage(
            WithFramework.withUserLogin(RegistrationPage)
        )
    )
);
