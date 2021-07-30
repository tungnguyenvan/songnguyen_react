import ProductNameApiService from "app/api/ProductNameApiService"
import ProductTypeApiService from "app/api/ProductTypeApiService"
import IProductNameModel from "app/documents/IProductNameModel"
import IProductTypeModel from "app/documents/IProductTypeModel"
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
import Rule from "framework/documents/models/Rule"
import IMultipleOptionModel from "framework/documents/ui/IMultipleOptionItemModel"
import FrameworkUtils from "framework/utils/FrameworkUtils"
import React from "react"
import { ProductNameFormRef, ProductNameFormValidate } from "./ProductNameFormDefinition"

interface ProductNameDetailProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    appUrlContext: IAppUrlContext;
}

interface ProductNameDetailState {
    productName: IProductNameModel;
    productTypes: IProductTypeModel[];
}

interface PageParams {
    id: string
}

class ProductNameDetail extends React.Component<ProductNameDetailProps, ProductNameDetailState> {
    private productNameApiService: ProductNameApiService;
    private productTypeApiService: ProductTypeApiService;
    private productNameFormRef: ProductNameFormRef;
    private productNameFormValidate: ProductNameFormValidate;

    constructor(props: ProductNameDetailProps) {
        super(props)

        this.productNameFormRef = {
            inputName: React.createRef<IFormInputElement>(),
            productTypeOption: React.createRef<IFormInputElement>()
        }

        this.productNameFormValidate = {
            inputName: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)]
        }

        this.state = {
            productName: {} as IProductNameModel,
            productTypes: []
        }

        this.productNameApiService = new ProductNameApiService()
        this.productTypeApiService = new ProductTypeApiService()

        this.generateMultipleOptionItem = this.generateMultipleOptionItem.bind(this)
        this.onUpdateProductName = this.onUpdateProductName.bind(this)
        this.onDeleteProductName = this.onDeleteProductName.bind(this)
        this.requestDetail = this.requestDetail.bind(this)
        this.requestProductType = this.requestProductType.bind(this)
        this.generateMultipleOptionItem = this.generateMultipleOptionItem.bind(this)
        this.isProductTypeInProductName = this.isProductTypeInProductName.bind(this)
    }

    componentDidMount() {
        const urlParams = FrameworkUtils.matchPath(window.location.pathname, RouteConstant.PRODUCT_NAME_DETAIL)

        if (FrameworkUtils.isAlive(urlParams)) {
            this.requestDetail((urlParams?.params as PageParams).id)
        }

        this.requestProductType()
    }

    requestDetail(id: string) {
        this.productNameApiService.get(id)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        productName: response.data.data as IProductNameModel
                    })
                }
            })
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
                isSelected: this.isProductTypeInProductName(element._id)
            })
        })

        return multipleOptionItems
    }

    isProductTypeInProductName(productTypeId: string): boolean {
        let isConstraint = false;

        if (this.state.productName && this.state.productName.product_type) {
            (this.state.productName.product_type as IProductTypeModel[]).forEach(element => {
                if (element._id === productTypeId) isConstraint = true
            })
        }

        return isConstraint
    }

    onUpdateProductName() {
        if (FrameworkUtils.validateFrom(this.productNameFormRef) && FrameworkUtils.formHasChanged(this.productNameFormRef)) {
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

            this.productNameApiService.update(this.state.productName._id, productNameObj)
                .then(response => {
                    if (response.status === HttpRequestStatusCode.OK) {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS),
                            content: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS_DETAIL)
                        })

                        this.requestDetail(this.state.productName._id)
                    }
                })
        }

        if (!FrameworkUtils.formHasChanged(this.productNameFormRef)) {
            this.props.appDialogContext.addDialog({
                title: this.props.languageContext.current.getMessageString(MessageId.FORM_NOT_CHANGE),
                content: this.props.languageContext.current.getMessageString(MessageId.FORM_NOT_CHANGE_DETAIL)
            })
        }
    }

    onDeleteProductName() {
        this.productNameApiService.delete(this.state.productName._id)
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

    render() {
        return <FrameworkComponents.BasePage {...{
            title: this.props.languageContext.current.getMessageString(MessageId.PRODUCT_NAME_DETAIL)
        }}>
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_NAME)}
                        value={this.state.productName.name}
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
                        errorMessageRequired={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)} />
                </FrameworkComponents.FormGroup>

                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.DANGER}
                        dialogModel={{
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE_DETAIL)
                        }}
                        onClick={this.onDeleteProductName}>
                        {this.props.languageContext.current.getMessageString(MessageId.DELETE)}
                    </FrameworkComponents.Button>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.PRIMARY}
                        dialogModel={{
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE_DETAIL)
                        }}
                        onClick={this.onUpdateProductName}>
                        {this.props.languageContext.current.getMessageString(MessageId.UPDATE)}
                    </FrameworkComponents.Button>
            </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>
        </FrameworkComponents.BasePage>
    }
}

export default WithFramework.withLanguage(
    WithFramework.withAppDialog(
        WithFramework.withAppUrl(ProductNameDetail)
    )
)