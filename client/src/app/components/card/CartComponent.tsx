import React from "react"
import FrameworkComponents from "framework/components/FrameworkComponents"
import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext"
import IAppUrlContext from "framework/contexts/url/IAppUrlContext"
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant"
import MessageId from "framework/constants/MessageId"
import FrameworkUtils from "framework/utils/FrameworkUtils"
import ICartModel from "app/documents/ICartModel"
import CartApiService from "app/api/CartApiService"
import AppRenderUtils from "app/utils/AppRenderUtils"
import IUserLoginContext from "framework/contexts/user/IUserLoginContext"
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode"
import { CartStatus } from "framework/constants/AppEnumConstant"
import ITableCellModel from "framework/documents/ui/ITableCellModel"
import ICustomerModel from "app/documents/ICustomerModel"
import ICartItemModel from "app/documents/ICartItemModel"
import IProductNameModel from "app/documents/IProductNameModel"
import ISizeModel from "app/documents/ISizeModel"
import ISystemStandardModel from "app/documents/ISystemStandardModel"
import IStandardModel from "app/documents/IStandardModel"
import IProductTypeModel from "app/documents/IProductTypeModel"
import Style from "app/resources/css/CartComponent.module.scss"
import RouteConstant from "framework/constants/RouteConstant"
import AppUtils from "app/utils/AppUtils"

interface CartComponentProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    appUrlContext: IAppUrlContext;
    userLoginContext: IUserLoginContext;
}

interface CartComponentState {
    carts: ICartModel[]
    cartSelected: ICartModel
    totalPrice: number
}

class CartComponent extends React.Component<CartComponentProps, CartComponentState> {
    private cartApiService: CartApiService

    constructor(props: CartComponentProps) {
        super(props)

        this.cartApiService = new CartApiService()

        this.state = {
            carts: [],
            cartSelected: {} as ICartModel,
            totalPrice: 0
        }

        this.onEdit = this.onEdit.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.deleteSize = this.deleteSize.bind(this)
        this.calTotalPrice = this.calTotalPrice.bind(this)
        this.getCurrentCart = this.getCurrentCart.bind(this)
        this.onSelectedCart = this.onSelectedCart.bind(this)
        this.requestCartApi = this.requestCartApi.bind(this)
        this.exportExcelFile = this.exportExcelFile.bind(this)
        this.redirectViewAll = this.redirectViewAll.bind(this)
        this.renderCartItems = this.renderCartItems.bind(this)
        this.redirectEditSize = this.redirectEditSize.bind(this)
        this.getIdCartSelected = this.getIdCartSelected.bind(this)
        this.renderCustomerTable = this.renderCustomerTable.bind(this)
    }

    componentDidMount() {
        if (this.props.userLoginContext.state.user) {
            this.requestCartApi()
        } else {
            this.props.userLoginContext.current.addEventUserLogin(this.requestCartApi)
        }
    }

    requestCartApi() {
        this.cartApiService.all({
            createdBy: this.props.userLoginContext.state.user._id,
            status: CartStatus.DISCUSS
        })
        .then(response => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.setState({
                    carts: response.data.data as ICartModel[]
                }, () => {
                    if (this.state.cartSelected._id) {
                        this.onSelectedCart(this.state.cartSelected._id)
                    }
                })
            }
        })
    }

    getCurrentCart(): ICartModel {
        return this.state.cartSelected
    }

    renderCustomerTable() {
        const tableCell: ITableCellModel[] = []
        if (this.state.cartSelected) {
            const customer = this.state.cartSelected.customer as ICustomerModel
            tableCell.push({
                id: customer._id,
                content: [
                    customer.name,
                    customer.address,
                    customer.tax,
                    customer.email,
                    customer.phone_number,
                    customer.contact_name
                ]
            })
        }
        return tableCell
    }

    onSelectedCart(id: string) {
        let isSetState = false
        this.state.carts.forEach(element => {
            if (id === element._id) {
                isSetState = true
                this.setState({
                    cartSelected: element
                }, () => {
                    this.calTotalPrice()
                })
            }
        })

        if (!isSetState) {
            this.onCancel()
        }
    }

    calTotalPrice() {
        if (this.state.cartSelected._id) {
            let totalPrice = 0;
            (this.state.cartSelected.items as ICartItemModel[]).forEach(element => {
                totalPrice += element.total_price
            })

            this.setState({
                totalPrice: totalPrice
            })
        }
    }

    getIdCartSelected(): string {
        if (!this.state.cartSelected._id) {
            return ""
        }

        return this.state.cartSelected._id
    }

    redirectEditSize(id: string) {
        
    }

    deleteSize(id: string) {

    }

    renderCartItems(): ITableCellModel[] {
        let tableCells: ITableCellModel[] = [];

        (this.state.cartSelected.items as ICartItemModel[]).forEach((element: ICartItemModel) => {
            const size = element.size as ISizeModel
            tableCells.push({
                id: element._id,
                content: [
                    (element.product_type as IProductTypeModel)?.name,
                    (element.product_name as IProductNameModel)?.name,
                    size?.inner_diameter?.toString(),
                    size?.outer_diameter?.toString(),
                    size?.wn?.toString(),
                    size?.wt?.toString(),
                    size?.ln?.toString(),
                    size?.lt?.toString(),
                    size?.ir?.toString(),
                    size?.or?.toString(),
                    size?.hole_count?.toString(),
                    size?.hole_diameter?.toString(),
                    (element.system_standard as ISystemStandardModel)?.name,
                    (element.standard as IStandardModel)?.name,
                    element.amount?.toString(),
                    element.unit_price?.toLocaleString(),
                    FrameworkUtils.getDisplayNameDiscountType(element.discount_type, this.props.languageContext),
                    element.discount_percent?.toString(),
                    element.total_price?.toLocaleString(),
                    AppUtils.sourceTitle(this.props.languageContext, element.source),
                    element.delivered.toString()
                ],
                action: {
                    edit: {
                        isAlive: false,
                        func: this.redirectEditSize
                    },
                    delete: {
                        isAlive: true,
                        func: this.deleteSize,
                        dialog: {
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE_DETAIL)
                        }
                    }
                }
            })
        })

        return tableCells
    }

    onCancel() {
        this.setState({
            cartSelected: {} as ICartModel
        })
    }

    onEdit() {
        if (this.state.cartSelected._id) {
            this.props.appUrlContext.redirectTo(RouteConstant.CARTS + this.state.cartSelected._id)
        }
    }

    redirectViewAll() {
        this.props.appUrlContext.redirectTo(RouteConstant.CARTS)
    }

    exportExcelFile() {
        this.cartApiService.download(this.state.cartSelected._id)
            .then(response => {
                window.location.assign(response.data.data.url)
            })
    }

    render() {
        return <FrameworkComponents.BasePage {...{
            disableBackButton: true
        }}>
            {FrameworkUtils.isBlank(this.state.cartSelected._id) && 
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button type={ButtonTypeConstant.PRIMARY} onClick={() => {
                        this.props.appUrlContext.redirectTo(RouteConstant.CART_CREATE)
                    }}>{this.props.languageContext.current.getMessageString(MessageId.CREATE_NEW_CART)}</FrameworkComponents.Button>
                </FrameworkComponents.FormGroup>
                <span>{this.props.languageContext.current.getMessageString(MessageId.OR)}</span>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.CHOOSE_CART)}
                        options={AppRenderUtils.renderCartSelectBox(this.state.carts)}
                        onChanged={this.onSelectedCart} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.FLAT}
                        onClick={this.redirectViewAll}>
                        {this.props.languageContext.current.getMessageString(MessageId.VIEW_ALL)}
                    </FrameworkComponents.Button>
                </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>}

            {!FrameworkUtils.isBlank(this.state.cartSelected._id) &&
            <div>
                <FrameworkComponents.Table {...{
                    header: [
                        this.props.languageContext.current.getMessageString(MessageId.NAME),
                        this.props.languageContext.current.getMessageString(MessageId.ADDRESS),
                        this.props.languageContext.current.getMessageString(MessageId.TAX_CODE),
                        this.props.languageContext.current.getMessageString(MessageId.EMAIL),
                        this.props.languageContext.current.getMessageString(MessageId.PHONE_NUMBER),
                        this.props.languageContext.current.getMessageString(MessageId.CONTACT_NAME)
                    ],
                    content: this.renderCustomerTable(),
                    isDisableSearchComponent: true,
                    title: this.props.languageContext.current.getMessageString(MessageId.CUSTOMERS)
                }} />
                <FrameworkComponents.Table {...{
                    content: this.renderCartItems(),
                    title: this.props.languageContext.current.getMessageString(MessageId.PRODUCTS),
                    isDisableSearchComponent: true,
                    header: [
                        this.props.languageContext.current.getMessageString(MessageId.PRODUCT_TYPE),
                        this.props.languageContext.current.getMessageString(MessageId.PRODUCT_NAME),
                        this.props.languageContext.current.getMessageString(MessageId.INNER_DIAMETER),
                        this.props.languageContext.current.getMessageString(MessageId.OUTER_DIAMETER),
                        this.props.languageContext.current.getMessageString(MessageId.WN_DIAMETER),
                        this.props.languageContext.current.getMessageString(MessageId.WT_DIAMETER),
                        this.props.languageContext.current.getMessageString(MessageId.LN_DIAMETER),
                        this.props.languageContext.current.getMessageString(MessageId.LT_DIAMETER),
                        this.props.languageContext.current.getMessageString(MessageId.IR_DIAMETER),
                        this.props.languageContext.current.getMessageString(MessageId.OR_DIAMETER),
                        this.props.languageContext.current.getMessageString(MessageId.HOLE_COUNT),
                        this.props.languageContext.current.getMessageString(MessageId.HOLE_DIAMETER),
                        this.props.languageContext.current.getMessageString(MessageId.SYSTEM_STANDARD),
                        this.props.languageContext.current.getMessageString(MessageId.STANDARD),
                        this.props.languageContext.current.getMessageString(MessageId.AMOUNT),
                        this.props.languageContext.current.getMessageString(MessageId.UNIT_PRICE),
                        this.props.languageContext.current.getMessageString(MessageId.DISCOUNT_TYPE),
                        this.props.languageContext.current.getMessageString(MessageId.PERCENT),
                        this.props.languageContext.current.getMessageString(MessageId.TOTAL_AMOUNT),
                        this.props.languageContext.current.getMessageString(MessageId.SOURCE),
                        this.props.languageContext.current.getMessageString(MessageId.DELIVERY),
                        this.props.languageContext.current.getMessageString(MessageId.ACTION)
                    ]
                }} />
                <div className={Style.total__price__container}>
                    <table>
                        <tbody>
                            <tr>
                                <td>{this.props.languageContext.current.getMessageString(MessageId.TOTAL_AMOUNT)} (VNĐ):</td>
                                <td className={Style.text__right}>{this.state.totalPrice.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td>{this.props.languageContext.current.getMessageString(MessageId.VAT)} 10% (VNĐ):</td>
                                <td className={Style.text__right}>{(this.state.totalPrice * 10 / 100).toLocaleString()}</td>
                            </tr>
                            <tr>
                                <td>{this.props.languageContext.current.getMessageString(MessageId.PRICE)} (VNĐ):</td>
                                <td className={Style.text__right}>{(this.state.totalPrice + (this.state.totalPrice * 10 / 100)).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <FrameworkComponents.BaseForm title={this.props.languageContext.current.getMessageString(MessageId.ACTION)}>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.Button
                            type={ButtonTypeConstant.FLAT}
                            onClick={this.onEdit}>
                            {this.props.languageContext.current.getMessageString(MessageId.EDIT)}
                        </FrameworkComponents.Button>
                        <FrameworkComponents.Button
                            type={ButtonTypeConstant.DANGER}
                            onClick={this.onCancel}>
                            {this.props.languageContext.current.getMessageString(MessageId.CANCEL)}
                        </FrameworkComponents.Button>
                        <FrameworkComponents.Button type={ButtonTypeConstant.PRIMARY}
                            onClick={this.exportExcelFile}>
                            {this.props.languageContext.current.getMessageString(MessageId.EXPORT_ORDER)}
                        </FrameworkComponents.Button>
                    </FrameworkComponents.FormGroup>
                </FrameworkComponents.BaseForm>
            </div>}
        </FrameworkComponents.BasePage>
    }
}

export default CartComponent