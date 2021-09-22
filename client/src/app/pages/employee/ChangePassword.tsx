import UserApiService from "framework/api/UserApiService"
import FrameworkComponents from "framework/components/FrameworkComponents"
import IFormInputElement from "framework/components/IFormInputElement"
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant"
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode"
import MessageId from "framework/constants/MessageId"
import RouteConstant from "framework/constants/RouteConstant"
import RuleConstant from "framework/constants/RuleConstant"
import WithFramework from "framework/constants/WithFramework"
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext"
import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import IAppUrlContext from "framework/contexts/url/IAppUrlContext"
import IUserLoginContext from "framework/contexts/user/IUserLoginContext"
import Rule from "framework/documents/models/Rule"
import FrameworkUtils from "framework/utils/FrameworkUtils"
import React from "react"

interface ChangePasswordProps {
    languageContext: ILanguageContext;
    appUrlContext: IAppUrlContext;
    appDialogContext: IAppDialogContext;
    userLoginContext: IUserLoginContext;
}

interface ChangePasswordState {
    userId: string;
}

interface ChangePasswordFormRef {
    currentPassword: React.RefObject<any>;
    newPassword: React.RefObject<any>;
    confirmPassword: React.RefObject<any>;
}

interface IChangePasswordFormRule {
    currentPassword: Rule[];
    newPassword: Rule[];
    confirmPassword: Rule[];
}

interface IParams {
    id: string
}

class ChangePassword extends React.Component<ChangePasswordProps, ChangePasswordState> {
    private changePasswordFormRef: ChangePasswordFormRef;
    private userApiService: UserApiService;
    private changePasswordFormRule: IChangePasswordFormRule;

    constructor(props: ChangePasswordProps) {
        super(props);

        this.changePasswordFormRef = {
            currentPassword: React.createRef<IFormInputElement>(),
            newPassword: React.createRef<IFormInputElement>(),
            confirmPassword: React.createRef<IFormInputElement>(),
        }
        this.userApiService = new UserApiService();
        this.changePasswordFormRule = {
            currentPassword: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)],
            newPassword: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)],
            confirmPassword: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)]
        }

        this.state = {
            userId: ""
        }

        this.onChangePassword = this.onChangePassword.bind(this);
        this.isShowInput = this.isShowInput.bind(this);
    }

    componentDidMount() {
        const path = FrameworkUtils.matchPath(window.location.pathname, RouteConstant.CHANGE_PASSWORD_ID);
        if (path && (path.params as IParams).id.length >= 24) {
            this.setState({
                userId: (path.params as IParams).id
            })
        }
    }

    onChangePassword() {
        if (FrameworkUtils.validateFrom(this.changePasswordFormRef)) {
            if (this.changePasswordFormRef.confirmPassword.current.getValue() === this.changePasswordFormRef.newPassword.current.getValue()) {
                this.userApiService.changePassword(this.state.userId, {
                    current_password: this.changePasswordFormRef.currentPassword.current.getValue(),
                    new_password: this.changePasswordFormRef.newPassword.current.getValue()
                }).then(response => {
                    if (response.status === HttpRequestStatusCode.OK) {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS),
                            content: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS_DETAIL)
                        })
                        this.props.userLoginContext.current.logout();
                    } else {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE_DETAIL)
                        })
                    }
                }).catch(error => {
                    if (error.response.status === HttpRequestStatusCode.NOT_FOUND) {
                        this.changePasswordFormRef.currentPassword.current.setErrorMessage(this.props.languageContext.current.getMessageString(MessageId.PASSWORD_FAILED));
                    } else {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.SERVER_ERROR),
                            content: this.props.languageContext.current.getMessageString(MessageId.SERVER_ERROR_CONTENT)
                        })
                    }
                })
            } else {
                this.changePasswordFormRef.confirmPassword.current.setErrorMessage(this.props.languageContext.current.getMessageString(MessageId.VALIDATE_CONFIRM_PASSWORD))
            }
        }
    }

    isShowInput(): boolean {
        return FrameworkUtils.isBlank(this.state.userId) && this.props.userLoginContext.state?.user?._id === this.state.userId
    }

    render() {
        return <FrameworkComponents.BasePage {...{
            title: this.props.languageContext.current.getMessageString(MessageId.CHANGE_PASSWORD)
        }}>
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.CURRENT_PASSWORD)}
                        ref={this.changePasswordFormRef.currentPassword}
                        validate={this.changePasswordFormRule.currentPassword}
                        type="password"
                        readOnly={this.isShowInput()} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.NEW_PASSWORD)}
                        ref={this.changePasswordFormRef.newPassword}
                        validate={this.changePasswordFormRule.newPassword}
                        type="password"
                        readOnly={this.isShowInput()} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.CONFIRM_PASSWORD)}
                        ref={this.changePasswordFormRef.confirmPassword}
                        validate={this.changePasswordFormRule.confirmPassword}
                        type="password"
                        readOnly={this.isShowInput()} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.PRIMARY}
                        onClick={this.onChangePassword}
                        dialogModel={{
                            title: this.props.languageContext.current.getMessageString(MessageId.CHANGE_PASSWORD),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE_DETAIL)
                        }} >
                        {this.props.languageContext.current.getMessageString(MessageId.CHANGE_PASSWORD)}
                    </FrameworkComponents.Button>
                </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>
        </FrameworkComponents.BasePage>
    }
}

export default WithFramework.withAppUrl(WithFramework.withLanguage(WithFramework.withAppDialog(WithFramework.withUserLogin(ChangePassword))));