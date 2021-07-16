import ProductNameApiService from "app/api/ProductNameApiService"
import ProductTypeApiService from "app/api/ProductTypeApiService"
import IProductNameModel from "app/documents/IProductNameModel"
import IProductTypeModel from "app/documents/IProductTypeModel"
import FrameworkComponents from "framework/components/FrameworkComponents"
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant"
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode"
import MessageId from "framework/constants/MessageId"
import RouteConstant from "framework/constants/RouteConstant"
import WithFramework from "framework/constants/WithFramework"
import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import IMultipleOptionModel from "framework/documents/ui/IMultipleOptionItemModel"
import FrameworkUtils from "framework/utils/FrameworkUtils"
import React from "react"

interface ProductNameDetailProps {
    languageContext: ILanguageContext;
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

    constructor(props: ProductNameDetailProps) {
        super(props)

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
            this.state.productName.product_type.forEach(element => {
                if (element._id === productTypeId) isConstraint = true
            })
        }

        return isConstraint
    }

    onUpdateProductName() {

    }

    onDeleteProductName() {

    }

    render() {
        return <FrameworkComponents.BasePage {...{
            title: this.props.languageContext.current.getMessageString(MessageId.PRODUCT_NAME_DETAIL)
        }}>
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_NAME)}
                        value={this.state.productName.name} />
                </FrameworkComponents.FormGroup>

                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.MultipleOption options={this.generateMultipleOptionItem()} title={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_TYPE)} />
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
    ProductNameDetail
)