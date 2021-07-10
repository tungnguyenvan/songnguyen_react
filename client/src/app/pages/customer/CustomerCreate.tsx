import CustomerApiService from "app/api/CustomerApiService"
import ICustomerModel from "app/documents/ICustomerModel"
import FrameworkComponents from "framework/components/FrameworkComponents"
import AppConstant from "framework/constants/AppConstant"
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant"
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode"
import MessageId from "framework/constants/MessageId"
import RouteConstant from "framework/constants/RouteConstant"
import RuleConstant from "framework/constants/RuleConstant"
import WithFramework from "framework/constants/WithFramework"
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext"
import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import IAppUrlContext from "framework/contexts/url/IAppUrlContext"
import Rule from "framework/documents/models/Rule"
import FrameworkUtils from "framework/utils/FrameworkUtils"
import React from "react"
import { ICustomerFormRef, ICustomerFormRule } from "./ICustomerFormDefinition"

interface CustomerCreateProps {
    languageContext: ILanguageContext
    appDialogContext: IAppDialogContext
    appUrlContext: IAppUrlContext
}

class CustomerCreate extends React.Component<CustomerCreateProps> {
    private customerApiService: CustomerApiService;
    private customerFormRef: ICustomerFormRef;
    private customerFormRule: ICustomerFormRule;

    constructor(props: CustomerCreateProps) {
        super(props)

        this.customerFormRef = {
            name: React.createRef(),
            address: React.createRef(),
            tax_code: React.createRef(),
            email: React.createRef(),
            phone_numner: React.createRef(),
            contact_name: React.createRef()
        }

        this.customerFormRule = {
            name: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)],

            address: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)],
            
            tax_code: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE),
                new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_NUMBER, new RegExp(/^[0-9]*$/gm)),
                new Rule(RuleConstant.MIN, MessageId.VALIDATE_TAX_CODE, 10),
                new Rule(RuleConstant.MAX, MessageId.VALIDATE_TAX_CODE, 13)],

            email: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE),
                new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_EMAIL, AppConstant.EMAIL_REGEXP)],

            phone_number: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE),
                new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_NUMBER, new RegExp(/^[0-9]*$/gm)),
                new Rule(RuleConstant.MIN, MessageId.VALIDATE_PHONE_NUMBER, 10),
                new Rule(RuleConstant.MAX, MessageId.VALIDATE_PHONE_NUMBER, 10)],

            contact_name: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)]
        }

        this.customerApiService = new CustomerApiService();

        this.onCancel = this.onCancel.bind(this)
        this.onRegistration = this.onRegistration.bind(this)
    }

    onCancel() {
        FrameworkUtils.formClear(this.customerFormRef)
    }

    onRegistration() {
        if (FrameworkUtils.validateFrom(this.customerFormRef)) {
            const customer: ICustomerModel = {
                name: (this.customerFormRef.name.current?.getValue() as string),
                address: (this.customerFormRef.address.current?.getValue() as string),
                tax: (this.customerFormRef.tax_code.current?.getValue() as string),
                email: (this.customerFormRef.email.current?.getValue() as string),
                phone_number: (this.customerFormRef.phone_numner.current?.getValue() as string),
                contact_name: (this.customerFormRef.contact_name.current?.getValue() as string)
            } as ICustomerModel;

            this.customerApiService.save(customer)
                .then(response => {
                    if (response.status === HttpRequestStatusCode.CREATED) {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS),
                            content: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS_CONTENT)
                        })

                        this.props.appUrlContext.redirectTo(RouteConstant.CUSTOMER)
                    } else {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_FAILED),
                            content: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_FAILED_CONTENT)
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
        <FrameworkComponents.BasePage title={this.props.languageContext.current.getMessageString(MessageId.CUSTOMER_CREATE)}>
            <FrameworkComponents.BaseForm>
            <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.CUSTOMER_NAME)}
                        validate={this.customerFormRule.name}
                        ref={this.customerFormRef.name} />
                </FrameworkComponents.FormGroup>

                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.ADDRESS)}
                        validate={this.customerFormRule.address}
                        ref={this.customerFormRef.address} />
                </FrameworkComponents.FormGroup>

                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.TAX_CODE)}
                        validate={this.customerFormRule.tax_code}
                        ref={this.customerFormRef.tax_code} />
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.EMAIL)}
                        ref={this.customerFormRef.email}
                        validate={this.customerFormRule.email} />
                </FrameworkComponents.FormGroup>

                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.PHONE_NUMBER)}
                        validate={this.customerFormRule.phone_number}
                        ref={this.customerFormRef.phone_numner} />
                    
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.CONTACT_NAME)}
                        validate={this.customerFormRule.contact_name}
                        ref={this.customerFormRef.contact_name} />
                </FrameworkComponents.FormGroup>

                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.FLAT}
                        onClick={this.onCancel}>
                        {this.props.languageContext.current.getMessageString(MessageId.CANCEL)}
                    </FrameworkComponents.Button>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.PRIMARY}
                        dialogModel={{
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_REGISTRATION),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_REGISTRATION_CONTENT)
                        }}
                        onClick={this.onRegistration}>
                        {this.props.languageContext.current.getMessageString(MessageId.REGISTRATION)}
                    </FrameworkComponents.Button>
                </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>
        </FrameworkComponents.BasePage>)
    }
}

export default WithFramework.withLanguage(
    WithFramework.withAppUrl(
        WithFramework.withAppDialog(CustomerCreate)
    )
)