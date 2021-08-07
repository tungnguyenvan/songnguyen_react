import AppRenderUtils from "app/utils/AppRenderUtils";
import UserApiService from "framework/api/UserApiService";
import FrameworkComponents from "framework/components/FrameworkComponents";
import AppConstant from "framework/constants/AppConstant";
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant";
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode";
import MessageId from "framework/constants/MessageId";
import RouteConstant from "framework/constants/RouteConstant";
import RuleConstant from "framework/constants/RuleConstant";
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

interface EmployeeCreateProps {
    languageContext: ILanguageContext;
    appUrlContext: IAppUrlContext;
    appDialogContext: IAppDialogContext;
    userLoginContext: IUserLoginContext;
}

class EmployeeCreate extends React.Component<EmployeeCreateProps> {
    private userApiService: UserApiService;
    private formRef: IEmployeeFormRef;
    private formValidate: IEmployeeFormValidate;

    constructor(props: EmployeeCreateProps) {
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

        this.onCancel = this.onCancel.bind(this)
        this.onRegistration = this.onRegistration.bind(this)
    }

    onCancel() {
        FrameworkUtils.formClear(this.formRef)
    }

    onRegistration() {
        if (FrameworkUtils.validateFrom(this.formRef)) {
            if (this.formRef.password.current.getValue() === this.formRef.confirmPassword.current.getValue()) {
                const userModel: IUserModel = {
                    email: this.formRef.email.current.getValue(),
                    firstName: this.formRef.firstName.current.getValue(),
                    lastName: this.formRef.lastName.current.getValue(),
                    birthDate: this.formRef.birthDate.current.getValue(),
                    phoneNumber: this.formRef.phoneNumber.current.getValue(),
                    role: this.formRef.role.current.getValue(),
                    password: this.formRef.password.current.getValue()
                } as IUserModel

                this.userApiService.save(userModel)
                    .then(response => {
                        if (response.status === HttpRequestStatusCode.CREATED) {
                            this.props.appDialogContext.addDialog({
                                title: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS),
                                content: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS_CONTENT)
                            })
                            this.props.appUrlContext.redirectTo(RouteConstant.EMPLOYEE + (response.data.data as IUserModel)._id)
                        } else {
                            this.props.appDialogContext.addDialog({
                                title: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_FAILED),
                                content: this.props.languageContext.current.getMessageString(MessageId.REGIS_EMPLOYEE_FAILED)
                            })
                        }
                    })
                    .catch(error => {
                        if (error.response.status === HttpRequestStatusCode.INTERNAL_SERVER_ERROR) {
                            this.props.appDialogContext.addDialog({
                                title: this.props.languageContext.current.getMessageString(MessageId.SERVER_ERROR),
                                content: this.props.languageContext.current.getMessageString(MessageId.SERVER_ERROR_CONTENT)
                            })
                        } else {
                            this.props.appDialogContext.addDialog({
                                title: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_FAILED),
                                content: this.props.languageContext.current.getMessageString(MessageId.REGIS_EMPLOYEE_FAILED)
                            })
                        }
                    })
            } else {
                this.formRef.confirmPassword.current.setErrorMessage(this.props.languageContext.current.getMessageString(MessageId.VALIDATE_CONFIRM_PASSWORD))
            }
        }
    }

    render() {
        return (
            <FrameworkComponents.BasePage
                {...{
                    title: this.props.languageContext.current.getMessageString(MessageId.EMPLOYEE_CREATE),
                }}
            >
                <FrameworkComponents.BaseForm>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.EMAIL)}
                            ref={this.formRef.email}
                            validate={this.formValidate.email}
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.FIRST_NAME)}
                            ref={this.formRef.firstName}
                            validate={this.formValidate.firstName}
                        />
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.LAST_NAME)}
                            ref={this.formRef.lastName}
                            validate={this.formValidate.lastName}
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.BIRTH_DATE)}
                            ref={this.formRef.birthDate}
                            validate={this.formValidate.birthDate}
                        />
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.PHONE_NUMBER)}
                            ref={this.formRef.phoneNumber}
                            validate={this.formValidate.phoneNumber}
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.SelectBox
                            ref={this.formRef.role}
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.USER_ROLE)}
                            options={AppRenderUtils.renderUserRoleSelectBox(this.props.languageContext)}
                            required={true}
                            errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)} />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.PASSWORD)}
                            ref={this.formRef.password}
                            validate={this.formValidate.password}
                            type="password"
                        />
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.CONFIRM_PASSWORD)}
                            ref={this.formRef.confirmPassword}
                            validate={this.formValidate.confirmPassword}
                            type="password"
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.Button type={ButtonTypeConstant.FLAT} onClick={this.onCancel}>
                            {this.props.languageContext.current.getMessageString(MessageId.CANCEL)}
                        </FrameworkComponents.Button>
                        <FrameworkComponents.Button
                            type={ButtonTypeConstant.PRIMARY}
                            dialogModel={{
                                title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_REGISTRATION),
                                content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_REGISTRATION_CONTENT),
                            }}
                            onClick={this.onRegistration}
                        >
                            {this.props.languageContext.current.getMessageString(MessageId.REGISTRATION)}
                        </FrameworkComponents.Button>
                    </FrameworkComponents.FormGroup>
                </FrameworkComponents.BaseForm>
            </FrameworkComponents.BasePage>
        );
    }
}

export default WithFramework.withAppUrl(WithFramework.withLanguage(WithFramework.withAppDialog(WithFramework.withUserLogin(EmployeeCreate))));
