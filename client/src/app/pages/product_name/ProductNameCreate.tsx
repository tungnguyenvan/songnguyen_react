import ProductTypeApiService from "app/api/ProductTypeApiService"
import IProductTypeModel from "app/documents/IProductTypeModel"
import FrameworkComponents from "framework/components/FrameworkComponents"
import IFromInputElement from "framework/components/IFormInputElement"
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant"
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode"
import MessageId from "framework/constants/MessageId"
import RuleConstant from "framework/constants/RuleConstant"
import WithFramework from "framework/constants/WithFramework"
import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import Rule from "framework/documents/models/Rule"
import IMultipleOptionModel from "framework/documents/ui/IMultipleOptionItemModel"
import FrameworkUtils from "framework/utils/FrameworkUtils"
import { ProductNameFormRef, ProductNameFormValidate } from "./ProductNameFormDefinition"
import React from "react"
import IProductNameModel from "app/documents/IProductNameModel"
import ProductNameApiService from "app/api/ProductNameApiService"
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext"
import IAppUrlContext from "framework/contexts/url/IAppUrlContext"
import RouteConstant from "framework/constants/RouteConstant"

interface ProductNameCreateProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    appUrlContext: IAppUrlContext;
}

interface ProductNameCreateState {
    productTypes: IProductTypeModel[]
}

class ProductNameCreate extends React.Component<ProductNameCreateProps, ProductNameCreateState> {
    private productNameApiService: ProductNameApiService;
    private productTypeApiService: ProductTypeApiService;
    private productNameFormRef: ProductNameFormRef;
    private productNameFormValidate: ProductNameFormValidate;

    constructor(props: ProductNameCreateProps) {
        super(props)

        this.productNameFormRef = {
            inputName: React.createRef<IFromInputElement>(),
            productTypeOption: React.createRef<IFromInputElement>()
        }

        this.productNameFormValidate = {
            inputName: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)]
        }
        this.productTypeApiService = new ProductTypeApiService();
        this.productNameApiService = new ProductNameApiService();

        this.state = {
            productTypes: []
        }

        this.requestProductType = this.requestProductType.bind(this)
        this.generateMultipleOptionItem = this.generateMultipleOptionItem.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.onRegistration = this.onRegistration.bind(this)
    }

    componentDidMount() {
        this.requestProductType()
    }

    requestProductType() {
        this.productTypeApiService.all()
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        productTypes: response.data.data as IProductTypeModel[]
                    })
                }
            })
    }

    generateMultipleOptionItem(): IMultipleOptionModel[] {
        const multipleOptionItems: IMultipleOptionModel[] = []

        this.state.productTypes.forEach(element => {
            multipleOptionItems.push({
                id: element._id,
                title: element.name,
                isSelected: false
            })
        })

        return multipleOptionItems
    }

    onCancel() {
        FrameworkUtils.formClear(this.productNameFormRef)
    }

    onRegistration() {
        if (FrameworkUtils.validateFrom(this.productNameFormRef)) {
            // get product type
            const productTypesSelected: string[] = []
            const multipleOptions: IMultipleOptionModel[] = this.productNameFormRef.productTypeOption.current.getValue() as IMultipleOptionModel[]
            multipleOptions.forEach(element => {
                if (element.isSelected) {
                    productTypesSelected.push(element.id)
                }
            })

            const productNameObj: IProductNameModel = {
                name: this.productNameFormRef.inputName.current.getValue(),
                product_type: productTypesSelected
            } as IProductNameModel

            this.productNameApiService.save(productNameObj)
                .then(response => {
                    if (response.status === HttpRequestStatusCode.CREATED) {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS),
                            content: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS_CONTENT)
                        })

                        this.props.appUrlContext.redirectTo(RouteConstant.PRODUCT_NAME + '/' + (response.data.data as IProductNameModel)._id)
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
            title: this.props.languageContext.current.getMessageString(MessageId.PRODUCT_NAME_CREATE)
        }}>
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_NAME)}
                        ref={this.productNameFormRef.inputName}
                        validate={this.productNameFormValidate.inputName} />
                </FrameworkComponents.FormGroup>

                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.MultipleOption
                        ref={this.productNameFormRef.productTypeOption}
                        options={this.generateMultipleOptionItem()}
                        defaultValue={this.generateMultipleOptionItem()}
                        title={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_TYPE)}
                        required={true}
                        errorMessageRequired={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                    />
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
        WithFramework.withAppUrl(ProductNameCreate)
    )
)