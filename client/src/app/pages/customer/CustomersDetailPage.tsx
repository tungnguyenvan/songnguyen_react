import React from "react"
import FrameworkComponents from "framework/components/FrameworkComponents"
import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import MessageId from "framework/constants/MessageId"
import WithFramework from "framework/constants/WithFramework"
import RouteConstant from "framework/constants/RouteConstant"
import FrameworkUtils from "framework/utils/FrameworkUtils"
import ICustomerModel from "app/documents/ICustomerModel"
import CustomerApiService from "app/api/CustomerApiService"
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode"
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext"
import IDialogModel from "framework/documents/ui/IDialogModel"
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant"
import IUserLoginContext from "framework/contexts/user/IUserLoginContext"
import { UserRole } from "framework/constants/UserEnumConstant"
import IUpdateDeleteResponseModel from "framework/documents/response/IUpdateDeleteResponseModel"
import IAppUrlContext from "framework/contexts/url/IAppUrlContext"
import Rule from "framework/documents/models/Rule"
import RuleConstant from "framework/constants/RuleConstant"
import AppConstant from "framework/constants/AppConstant"
import { ICustomerFormRef, ICustomerFormRule } from "./ICustomerFormDefinition"

interface CustomersDetailPageProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    userLoginContext: IUserLoginContext;
    appUrlContext: IAppUrlContext;
}

interface CustomersPageState {
    customer: ICustomerModel
}

interface PageParams {
    id: string
}

class CustomersDetailPage extends React.Component<CustomersDetailPageProps, CustomersPageState> {
    private customerApiService: CustomerApiService;
    private customerFormRef: ICustomerFormRef;
    private customerFormRule: ICustomerFormRule;

    constructor(props: CustomersDetailPageProps) {
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

        this.state = {
            customer: {} as ICustomerModel
        }

        this.formValidate = this.formValidate.bind(this)
        this.onBtnDeleteCicked = this.onBtnDeleteCicked.bind(this)
        this.backToCustomerPage = this.backToCustomerPage.bind(this)
        this.onBtnUpdateClicked = this.onBtnUpdateClicked.bind(this)
        this.disableDeleteButton = this.disableDeleteButton.bind(this)
        this.disableUpdateButton = this.disableUpdateButton.bind(this)
        this.requestCustomerDetail = this.requestCustomerDetail.bind(this)
    }

    disableDeleteButton(): boolean {
        if (this.props.userLoginContext?.state?.user?.role === UserRole.ADMIN) {
            return false;
        }

        if (this.props.userLoginContext?.state?.user?._id === this.state.customer?.createdBy?._id) {
            return false;
        }

        return true;
    }

    disableUpdateButton(): boolean {
        if (this.props.userLoginContext?.state?.user?.role === UserRole.ADMIN) {
            return false;
        }

        if (this.props.userLoginContext?.state?.user?._id === this.state.customer?.createdBy?._id) {
            return false;
        }

        return true
    }

    componentDidMount() {
        const routeData = FrameworkUtils.matchPath(window.location.pathname, RouteConstant.CUSTOMER_DETAIL)

        if (FrameworkUtils.isAlive(routeData)) {
            this.requestCustomerDetail((routeData?.params as PageParams).id)
        }
    }

    requestCustomerDetail(id: string) {
        this.customerApiService.get(id)
                .then(response => {
                    if (response.status === HttpRequestStatusCode.OK && response.data.data) {
                        this.setState({
                            customer: response.data.data as ICustomerModel
                        })
                    } else {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.NOT_FOUND),
                            content: this.props.languageContext.current.getMessageString(MessageId.CUSTOMER_NOT_FOUND),
                            action: this.backToCustomerPage
                        } as IDialogModel)
                    }
                })
                .catch(error => {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.NOT_FOUND),
                        content: this.props.languageContext.current.getMessageString(MessageId.CUSTOMER_NOT_FOUND),
                        action: this.backToCustomerPage
                    } as IDialogModel)
                })
    }

    formValidate(): boolean {
        return FrameworkUtils.validateFrom(this.customerFormRef)
    }

    dataHasChanged() {
        return FrameworkUtils.formHasChanged(this.customerFormRef)
    }

    backToCustomerPage() {
        this.props.appUrlContext.redirectTo(RouteConstant.CUSTOMER)
    }

    onBtnDeleteCicked() {
        this.customerApiService.delete(this.state.customer._id)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    if ((response.data.data as IUpdateDeleteResponseModel).n) {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS),
                            content: this.props.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS_DETAIL),
                            action: this.backToCustomerPage
                        })
                    } else {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.CANNOT_DELETE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CANNOT_DELETE_DETAIL)
                        })
                    }
                }
            })
            .catch(error => {
                this.props.appDialogContext.addDialog({
                    title: this.props.languageContext.current.getMessageString(MessageId.CANNOT_DELETE),
                    content: this.props.languageContext.current.getMessageString(MessageId.CANNOT_DELETE_DETAIL)
                })
            })
    }

    onBtnUpdateClicked() {
        if (!this.dataHasChanged()) {
            this.props.appDialogContext.addDialog({
                title: this.props.languageContext.current.getMessageString(MessageId.FORM_NOT_CHANGE),
                content: this.props.languageContext.current.getMessageString(MessageId.FORM_NOT_CHANGE_DETAIL)
            })
        }

        if (this.formValidate() && this.dataHasChanged()) {
            const customer: ICustomerModel = {
                name: (this.customerFormRef.name.current?.getValue() as string),
                address: (this.customerFormRef.address.current?.getValue() as string),
                tax: (this.customerFormRef.tax_code.current?.getValue() as string),
                email: (this.customerFormRef.email.current?.getValue() as string),
                phone_number: (this.customerFormRef.phone_numner.current?.getValue() as string),
                contact_name: (this.customerFormRef.contact_name.current?.getValue() as string)
            } as ICustomerModel;

            this.customerApiService.update(this.state.customer._id, customer)
                .then(response => {
                    if (response.status === HttpRequestStatusCode.OK) {
                        this.setState({
                            customer: response.data.data as ICustomerModel
                        })
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS),
                            content: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS_DETAIL)
                        })
                    } else {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE_DETAIL)
                        })
                    }
                })
                .catch(error => {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE),
                        content: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE_DETAIL)
                    })
                })
        }
    }

    render() {
        return (
        <FrameworkComponents.BasePage title={this.props.languageContext.current.getMessageString(MessageId.CUSTOMERS_DETAIL)}>
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.CUSTOMER_NAME)}
                        value={this.state.customer.name}
                        validate={this.customerFormRule.name}
                        ref={this.customerFormRef.name} />
                </FrameworkComponents.FormGroup>

                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.ADDRESS)}
                        value={this.state.customer.address}
                        validate={this.customerFormRule.address}
                        ref={this.customerFormRef.address} />
                </FrameworkComponents.FormGroup>

                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.TAX_CODE)}
                        value={this.state.customer.tax}
                        validate={this.customerFormRule.tax_code}
                        ref={this.customerFormRef.tax_code} />
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.EMAIL)}
                        value={this.state.customer.email}
                        ref={this.customerFormRef.email}
                        validate={this.customerFormRule.email} />
                </FrameworkComponents.FormGroup>

                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.PHONE_NUMBER)}
                        value={this.state.customer.phone_number}
                        validate={this.customerFormRule.phone_number}
                        ref={this.customerFormRef.phone_numner} />
                    
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.CONTACT_NAME)}
                        value={this.state.customer.contact_name}
                        validate={this.customerFormRule.contact_name}
                        ref={this.customerFormRef.contact_name} />
                </FrameworkComponents.FormGroup>

                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.EMPLOYEE)}
                        value={FrameworkUtils.userName(this.state.customer.createdBy)}
                        readOnly={true} />
                </FrameworkComponents.FormGroup>

                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.DANGER}
                        disable={this.disableDeleteButton()}
                        onClick={this.onBtnDeleteCicked}
                        dialogModel={{
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE_DETAIL)
                        }}>
                            {this.props.languageContext.current.getMessageString(MessageId.DELETE)}
                    </FrameworkComponents.Button>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.PRIMARY}
                        disable={this.disableUpdateButton()}
                        onClick={this.onBtnUpdateClicked}
                        dialogModel={{
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE_DETAIL)
                        }}>
                            {this.props.languageContext.current.getMessageString(MessageId.UPDATE)}
                    </FrameworkComponents.Button>
                </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>
        </FrameworkComponents.BasePage>)
    }
}

export default WithFramework.withLanguage(
    WithFramework.withAppDialog(
        WithFramework.withUserLogin(
            WithFramework.withAppUrl(CustomersDetailPage)
        )
    )
)