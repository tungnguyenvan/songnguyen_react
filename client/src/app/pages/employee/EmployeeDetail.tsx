import AppRenderUtils from "app/utils/AppRenderUtils";
import UserApiService from "framework/api/UserApiService";
import FrameworkComponents from "framework/components/FrameworkComponents";
import AppConstant from "framework/constants/AppConstant";
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant";
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode";
import MessageId from "framework/constants/MessageId";
import RouteConstant from "framework/constants/RouteConstant";
import RuleConstant from "framework/constants/RuleConstant";
import { UserRole } from "framework/constants/UserEnumConstant";
import WithFramework from "framework/constants/WithFramework";
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import IAppUrlContext from "framework/contexts/url/IAppUrlContext";
import IUserLoginContext from "framework/contexts/user/IUserLoginContext";
import IUserModel from "framework/documents/models/IUserModel";
import Rule from "framework/documents/models/Rule";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import React from "react";
import { IEmployeeFormRef, IEmployeeFormValidate } from "./EmployeeFormDefinition";

interface EmployeeDetailProps {
    languageContext: ILanguageContext;
    appUrlContext: IAppUrlContext;
    appDialogContext: IAppDialogContext;
    userLoginContext: IUserLoginContext;
}

interface EmployeeDetailState {
    user: IUserModel
}

interface IParams {
    id: string
}

class EmployeeDetail extends React.Component<EmployeeDetailProps, EmployeeDetailState> {
    private userApiService: UserApiService;
    private formRef: IEmployeeFormRef;
    private formValidate: IEmployeeFormValidate;

    constructor(props: EmployeeDetailProps) {
        super(props);

        this.userApiService = new UserApiService();
        this.formRef = {
            email: React.createRef(),
            firstName: React.createRef(),
            lastName: React.createRef(),
            birthDate: React.createRef(),
            phoneNumber: React.createRef(),
            role: React.createRef(),
            password: React.createRef(),
            confirmPassword: React.createRef(),
        };
        this.formValidate = {
            email: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_EMAIL, AppConstant.EMAIL_REGEXP)],
            firstName: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)],
            lastName: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)],
            birthDate: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_DATE, new RegExp(AppConstant.DATE_REGEXP))],
            phoneNumber: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE),
                new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_NUMBER, new RegExp(/^[0-9]*$/gm)),
                new Rule(RuleConstant.MIN, MessageId.VALIDATE_PHONE_NUMBER, 10),
                new Rule(RuleConstant.MAX, MessageId.VALIDATE_PHONE_NUMBER, 10)],
            password: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)],
            confirmPassword: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)],
        };

        this.state = {
            user: {} as IUserModel
        }

        this.onUpdate = this.onUpdate.bind(this)
        this.onDelete = this.onDelete.bind(this)
    }

    componentDidMount() {
        const path = FrameworkUtils.matchPath(window.location.pathname, RouteConstant.EMPLOYEE_DETAIL)
        if (path) {
            this.requestApi((path.params as IParams).id)
        }
    }

    requestApi(id: string) {
        this.userApiService.get(id)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        user: response.data.data as IUserModel
                    })
                }
            })
    }

    onDelete() {
        this.userApiService.delete(this.state.user._id)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS),
                        content: this.props.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS_DETAIL)
                    })
                    this.props.appUrlContext.back()
                }
            })
    }

    onUpdate() {
        if (!FrameworkUtils.formHasChanged(this.formRef)) {
            this.props.appDialogContext.addDialog({
                title: this.props.languageContext.current.getMessageString(MessageId.FORM_NOT_CHANGE),
                content: this.props.languageContext.current.getMessageString(MessageId.FORM_NOT_CHANGE_DETAIL)
            })
        }

        if (FrameworkUtils.formHasChanged(this.formRef) && FrameworkUtils.validateFrom(this.formRef)) {
            const userModel: IUserModel = {
                email: this.formRef.email.current.getValue(),
                firstName: this.formRef.firstName.current.getValue(),
                lastName: this.formRef.lastName.current.getValue(),
                birthDate: this.formRef.birthDate.current.getValue(),
                phoneNumber: this.formRef.phoneNumber.current.getValue(),
                role: this.formRef.role.current.getValue()
            } as IUserModel

            this.userApiService.update(this.state.user._id, userModel)
                .then(response => {
                    if (response.status === HttpRequestStatusCode.OK) {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS),
                            content: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS_DETAIL)
                        })
                        this.requestApi(this.state.user._id)
                    } else {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE_DETAIL)
                        })
                    }
                })
                .catch(error => {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.SERVER_ERROR),
                        content: this.props.languageContext.current.getMessageString(MessageId.SERVER_ERROR_CONTENT)
                    })
                })
        }
    }

    render() {
        return (
            <FrameworkComponents.BasePage
                {...{
                    title: this.props.languageContext.current.getMessageString(MessageId.EMPLOYEE),
                }}
            >
                <FrameworkComponents.BaseForm>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.EMAIL)}
                            ref={this.formRef.email}
                            validate={this.formValidate.email}
                            value={this.state.user.email}
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.FIRST_NAME)}
                            ref={this.formRef.firstName}
                            validate={this.formValidate.firstName}
                            value={this.state.user.firstName}
                        />
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.LAST_NAME)}
                            ref={this.formRef.lastName}
                            validate={this.formValidate.lastName}
                            value={this.state.user.lastName}
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.BIRTH_DATE)}
                            ref={this.formRef.birthDate}
                            validate={this.formValidate.birthDate}
                            value={this.state.user.birthDate}
                        />
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.PHONE_NUMBER)}
                            ref={this.formRef.phoneNumber}
                            validate={this.formValidate.phoneNumber}
                            value={this.state.user.phoneNumber}
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.SelectBox
                            ref={this.formRef.role}
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.USER_ROLE)}
                            options={AppRenderUtils.renderUserRoleSelectBox(this.props.languageContext)}
                            required={true}
                            selectedId={this.state.user.role}
                            errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)} />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.Button type={ButtonTypeConstant.FLAT}
                        disable={!(this.props.userLoginContext.state.user._id === this.state.user._id)}
                        onClick={()=> {
                            this.props.appUrlContext.redirectTo(RouteConstant.CHANGE_PASSWORD + this.state.user._id)
                        }}>
                            {this.props.languageContext.current.getMessageString(MessageId.CHANGE_PASSWORD)}
                        </FrameworkComponents.Button>
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.Button type={ButtonTypeConstant.DANGER}
                            dialogModel={{
                                title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE),
                                content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE_DETAIL)
                            }}
                            disable={this.props.userLoginContext.state.user?.role !== UserRole.ADMIN}
                            onClick={this.onDelete}>
                            {this.props.languageContext.current.getMessageString(MessageId.DELETE)}
                        </FrameworkComponents.Button>
                        <FrameworkComponents.Button
                            type={ButtonTypeConstant.PRIMARY}
                            dialogModel={{
                                title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE),
                                content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE),
                            }}
                            disable={this.props.userLoginContext.state.user?.role !== UserRole.ADMIN}
                            onClick={this.onUpdate}
                        >
                            {this.props.languageContext.current.getMessageString(MessageId.UPDATE)}
                        </FrameworkComponents.Button>
                    </FrameworkComponents.FormGroup>
                </FrameworkComponents.BaseForm>
            </FrameworkComponents.BasePage>
        );
    }
}

export default WithFramework.withAppUrl(WithFramework.withLanguage(WithFramework.withAppDialog(WithFramework.withUserLogin(EmployeeDetail))));
