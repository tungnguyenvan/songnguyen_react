import ProductNameApiService from "app/api/ProductNameApiService"
import ThicknessApiService from "app/api/ThicknessApiService"
import IProductNameModel from "app/documents/IProductNameModel"
import IThicknessModel from "app/documents/IThicknessModel"
import FrameworkComponents from "framework/components/FrameworkComponents"
import IFormInputElement from "framework/components/IFormInputElement"
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
import ISelectOptionModel from "framework/documents/ui/ISelectOptionModel"
import FrameworkUtils from "framework/utils/FrameworkUtils"
import React from "react"
import { ThicknessFormRef, ThicknessFormValidate } from "./ThicknessFormDefinition"

interface ThicknessCreateProps {
    languageContext: ILanguageContext
    appDialogContext: IAppDialogContext
    appUrlContext: IAppUrlContext
}

interface ThicknessCreateState {
    productNames: IProductNameModel[]
}

class ThicknessCreate extends React.Component<ThicknessCreateProps, ThicknessCreateState> {
    private productNameApiService: ProductNameApiService;
    private thicknessApiService: ThicknessApiService;
    private thicknessFormRef: ThicknessFormRef;
    private thicknessFormValidate: ThicknessFormValidate;

    constructor(props: ThicknessCreateProps) {
        super(props)

        this.thicknessFormRef = {
            inputName: React.createRef<IFormInputElement>(),
            inputPrice: React.createRef<IFormInputElement>(),
            selectBoxProductName: React.createRef<IFormInputElement>()
        }
        this.thicknessFormValidate = {
            inputName: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)],
            inputPrice: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_NUMBER, new RegExp(AppConstant.ONLY_NUMBER_REGEXP))],
            selectBoxProductName: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)]
        }
        this.productNameApiService = new ProductNameApiService()
        this.thicknessApiService = new ThicknessApiService()

        this.state = {
            productNames: []
        }

        this.renderSelectBoxOption = this.renderSelectBoxOption.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.onRegistration = this.onRegistration.bind(this)
    }

    componentDidMount() {
        this.productNameApiService.all()
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        productNames: response.data.data as IProductNameModel[]
                    })
                }
            })
    }

    renderSelectBoxOption(): ISelectOptionModel[] {
        const selectOptions: ISelectOptionModel[] = []

        this.state.productNames.forEach(element => {
            selectOptions.push({
                id: element._id,
                title: element.name
            })
        })

        return selectOptions
    }

    onCancel() {
        FrameworkUtils.formClear(this.thicknessFormRef)
    }

    onRegistration() {
        if (FrameworkUtils.validateFrom(this.thicknessFormRef)) {
            const thickness: IThicknessModel = {
                name: this.thicknessFormRef.inputName.current.getValue(),
                price: this.thicknessFormRef.inputPrice.current.getValue(),
                product_name: this.thicknessFormRef.selectBoxProductName.current.getValue()
            } as IThicknessModel

            this.thicknessApiService.save(thickness)
                .then(response => {
                    if (response.status === HttpRequestStatusCode.CREATED) {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS),
                            content: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS_CONTENT)
                        })
                        this.props.appUrlContext.redirectTo(RouteConstant.THICKNESS + '/' + (response.data.data as IThicknessModel)._id)
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
        return <FrameworkComponents.BasePage {...{
            title: this.props.languageContext.current.getMessageString(MessageId.THICKNESS_CREATE)
        }}>
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        ref={this.thicknessFormRef.inputName}
                        validate={this.thicknessFormValidate.inputName}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.NAME)} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        ref={this.thicknessFormRef.inputPrice}
                        validate={this.thicknessFormValidate.inputPrice}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.M2_PRICE)} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        ref={this.thicknessFormRef.selectBoxProductName}
                        required={true}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_NAME)}
                        options={this.renderSelectBoxOption()} />
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
        </FrameworkComponents.BasePage>
    }
}

export default WithFramework.withLanguage(
    WithFramework.withAppDialog(
        WithFramework.withAppUrl(ThicknessCreate)
    )
)