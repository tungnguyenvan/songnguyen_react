import ProductTypeApiService from "app/api/ProductTypeApiService"
import SizeApiService from "app/api/SizeApiService"
import Form1 from "app/components/form/Form1"
import IProductTypeModel from "app/documents/IProductTypeModel"
import ISizeModel from "app/documents/ISizeModel"
import FrameworkComponents from "framework/components/FrameworkComponents"
import IFormInputElement from "framework/components/IFormInputElement"
import { FormType } from "framework/constants/AppEnumConstant"
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

interface SizeCreateProps {
    languageContext: ILanguageContext
    appDialogContext: IAppDialogContext
    appUrlContext: IAppUrlContext
}

interface SizeCreateState {
    productTypes: IProductTypeModel[]
    formType: FormType
}

interface ISizeFormRef {
    selectBoxProductType: React.RefObject<any>
    inputName: React.RefObject<any>
    form: React.RefObject<any>
}

class SizeCreate extends React.Component<SizeCreateProps, SizeCreateState> {
    private sizeApiService: SizeApiService
    private productTypeApiService: ProductTypeApiService
    private sizeFormRef: ISizeFormRef

    constructor(props: SizeCreateProps) {
        super(props)

        this.sizeFormRef = {
            selectBoxProductType: React.createRef<IFormInputElement>(),
            inputName: React.createRef<IFormInputElement>(),
            form: React.createRef<IFormInputElement>()
        }

        this.state = {
            productTypes: [],
            formType: undefined as unknown as FormType
        }

        this.sizeApiService = new SizeApiService()
        this.productTypeApiService = new ProductTypeApiService()
        this.onCancel = this.onCancel.bind(this)
        this.onRegistration = this.onRegistration.bind(this)
        this.onProductTypeChanged = this.onProductTypeChanged.bind(this)
    }

    componentDidMount() {
        // get product type
        this.productTypeApiService.all()
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        productTypes: response.data.data as IProductTypeModel[]
                    })
                }
            })
    }

    onProductTypeChanged(selectedId: string): void {
        this.state.productTypes.forEach(element => {
            if (element._id === selectedId) {
                this.setState({
                    formType: element.form_type
                })
            }
        })
    }

    onCancel() {
        FrameworkUtils.formClear(this.sizeFormRef)
    }

    onRegistration() {
        if (FrameworkUtils.validateFrom(this.sizeFormRef)) {
            const sizeModel: ISizeModel = this.sizeFormRef.form.current.getValue()
            sizeModel.name = this.sizeFormRef.inputName.current.getValue()
            
            this.state.productTypes.forEach(element => {
                if (element.form_type === FormType.FORM_1 && !sizeModel.product_type) {
                    sizeModel.product_type = element._id;
                }
            })
            sizeModel.form_type = FormType.FORM_1;
            
            this.sizeApiService.save(sizeModel)
                .then(response => {
                    if (response.status === HttpRequestStatusCode.CREATED) {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS),
                            content: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS_CONTENT)
                        })
                        this.props.appUrlContext.redirectTo(RouteConstant.SIZE + '/' + (response.data.data as ISizeModel)._id)
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
            title: this.props.languageContext.current.getMessageString(MessageId.SIZE_CREATE)
        }}>
            <FrameworkComponents.BaseForm>
                {/* <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        ref={this.sizeFormRef.selectBoxProductType}
                        required={true}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_TYPE)}
                        options={AppRenderUtils.renderProductTypeSelectBox(this.state.productTypes)}
                        onChanged={this.onProductTypeChanged} />
                </FrameworkComponents.FormGroup> */}
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        ref={this.sizeFormRef.inputName}
                        validate={[new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)]}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.NAME)} />
                </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>

            <Form1
                ref={this.sizeFormRef.form}
                isCalculatorModel={false}
                languageContext={this.props.languageContext} />
            
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.FLAT}
                        onClick={this.onCancel}>
                        {this.props.languageContext.current.getMessageString(MessageId.CANCEL)}
                    </FrameworkComponents.Button>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.PRIMARY}
                        onClick={this.onRegistration}
                        dialogModel={{
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_REGISTRATION),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_REGISTRATION_CONTENT)
                        }}>
                        {this.props.languageContext.current.getMessageString(MessageId.REGISTRATION)}
                    </FrameworkComponents.Button>
                </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>
        </FrameworkComponents.BasePage>
    }
}

export default WithFramework.withLanguage(
    WithFramework.withAppDialog(
        WithFramework.withAppUrl(SizeCreate)
    )
)