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

interface CartComponentProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    appUrlContext: IAppUrlContext;
    userLoginContext: IUserLoginContext;
}

interface CartComponentState {
    carts: ICartModel[]
    cartSelected: ICartModel
}

class CartComponent extends React.Component<CartComponentProps, CartComponentState> {
    private cartApiService: CartApiService

    constructor(props: CartComponentProps) {
        super(props)

        this.cartApiService = new CartApiService()

        this.state = {
            carts: [],
            cartSelected: {} as ICartModel
        }

        this.deleteSize = this.deleteSize.bind(this)
        this.redirectEditSize = this.redirectEditSize.bind(this)
        this.getCurrentCart = this.getCurrentCart.bind(this)
        this.onSelectedCart = this.onSelectedCart.bind(this)
        this.requestCartApi = this.requestCartApi.bind(this)
        this.renderCartItems = this.renderCartItems.bind(this)
        this.getIdCartSelected = this.getIdCartSelected.bind(this)
        this.renderCustomerTable = this.renderCustomerTable.bind(this)

        this.props.userLoginContext.current.addEventUserLogin(this.requestCartApi)
    }

    componentDidMount() {
        if (this.props.userLoginContext.state.user) {
            this.requestCartApi()
        }
    }

    requestCartApi() {
        this.cartApiService.all({
            createdBy: this.props.userLoginContext.state.user._id,
            status: CartStatus.DICUSS
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
        this.state.carts.forEach(element => {
            if (id === element._id) {
                this.setState({
                    cartSelected: element
                })
            }
        })
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
                    element.unit_price?.toString(),
                    FrameworkUtils.getDisplayNameDiscountType(element.discount_type, this.props.languageContext),
                    element.discount_percent?.toString(),
                    element.total_price?.toString()
                ],
                action: {
                    edit: {
                        isAlive: true,
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

    render() {
        return <FrameworkComponents.BasePage>
            {FrameworkUtils.isBlank(this.state.cartSelected._id) && 
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button type={ButtonTypeConstant.PRIMARY}>{this.props.languageContext.current.getMessageString(MessageId.CREATE_NEW_CART)}</FrameworkComponents.Button>
                </FrameworkComponents.FormGroup>
                <span>{this.props.languageContext.current.getMessageString(MessageId.OR)}</span>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.CHOOSE_CART)}
                        options={AppRenderUtils.renderCartSelectBox(this.state.carts)}
                        onChanged={this.onSelectedCart} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button type={ButtonTypeConstant.FLAT}>{this.props.languageContext.current.getMessageString(MessageId.VIEW_ALL)}</FrameworkComponents.Button>
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
                        this.props.languageContext.current.getMessageString(MessageId.ACTION)
                    ]
                }} />
                <FrameworkComponents.BaseForm title={this.props.languageContext.current.getMessageString(MessageId.ACTION)}>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.Button
                            type={ButtonTypeConstant.FLAT}>
                            {this.props.languageContext.current.getMessageString(MessageId.EDIT)}
                        </FrameworkComponents.Button>
                        <FrameworkComponents.Button
                            type={ButtonTypeConstant.DANGER}>
                            {this.props.languageContext.current.getMessageString(MessageId.CANCEL)}
                        </FrameworkComponents.Button>
                        <FrameworkComponents.Button type={ButtonTypeConstant.PRIMARY}>
                            {this.props.languageContext.current.getMessageString(MessageId.EXPORT_ORDER)}
                        </FrameworkComponents.Button>
                    </FrameworkComponents.FormGroup>
                </FrameworkComponents.BaseForm>
            </div>}
        </FrameworkComponents.BasePage>
    }
}

export default CartComponent