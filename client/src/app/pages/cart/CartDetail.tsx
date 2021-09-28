import CartApiService from "app/api/CartApiService"
import CartItemApiService from "app/api/CartItemApiService"
import CustomerApiService from "app/api/CustomerApiService"
import WarehouseApiService from "app/api/WarehouseApiService"
import ICartContext from "app/context/cart/ICartContext"
import WithCart from "app/context/cart/WithCart"
import ICartItemModel from "app/documents/ICartItemModel"
import ICartModel from "app/documents/ICartModel"
import ICustomerModel from "app/documents/ICustomerModel"
import IProductNameModel from "app/documents/IProductNameModel"
import IProductTypeModel from "app/documents/IProductTypeModel"
import ISizeModel from "app/documents/ISizeModel"
import IStandardModel from "app/documents/IStandardModel"
import ISystemStandardModel from "app/documents/ISystemStandardModel"
import IWarehouseModel from "app/documents/IWarehouseModel"
import AppRenderUtils from "app/utils/AppRenderUtils"
import FrameworkComponents from "framework/components/FrameworkComponents"
import IFormInputElement from "framework/components/IFormInputElement"
import { CartItemSource, CartItemStatus, CartStatus, TableRowColor } from "framework/constants/AppEnumConstant"
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant"
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode"
import MessageId from "framework/constants/MessageId"
import RouteConstant from "framework/constants/RouteConstant"
import { UserRole } from "framework/constants/UserEnumConstant"
import WithFramework from "framework/constants/WithFramework"
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext"
import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import IAppUrlContext from "framework/contexts/url/IAppUrlContext"
import IUserLoginContext from "framework/contexts/user/IUserLoginContext"
import IUserModel from "framework/documents/models/IUserModel"
import ITableCellModel from "framework/documents/ui/ITableCellModel"
import FrameworkUtils from "framework/utils/FrameworkUtils"
import React from "react"

interface CartDetailProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    userLoginContext: IUserLoginContext;
    appUrlContext: IAppUrlContext;
    cartContext: ICartContext
}

interface CartDetailState {
    cartModel: ICartModel
    customers: ICustomerModel[],
    isDone: boolean
}

interface IParams {
    id: string
}

class CartDetail extends React.Component<CartDetailProps, CartDetailState> {
    private cartApiService: CartApiService
    private customerApiService: CustomerApiService
    private cartStatusRef: React.RefObject<any>;
    private cartItemApiService: CartItemApiService;
    private warehouseApiService: WarehouseApiService;

    constructor(props: CartDetailProps) {
        super(props)

        this.cartApiService = new CartApiService()
        this.customerApiService = new CustomerApiService()
        this.cartItemApiService = new CartItemApiService();
        this.warehouseApiService = new WarehouseApiService();
        this.cartStatusRef = React.createRef<IFormInputElement>()

        this.state = {
            cartModel: {} as ICartModel,
            customers: [],
            isDone: true
        }

        this.onUpdateCart = this.onUpdateCart.bind(this)
        this.onDeleteCart = this.onDeleteCart.bind(this)
        this.deleteSize = this.deleteSize.bind(this)
        this.redirectEditSize = this.redirectEditSize.bind(this)
        this.renderCartItems = this.renderCartItems.bind(this)
        this.cartStatusOnChange = this.cartStatusOnChange.bind(this)
        this.renderCustomerTable = this.renderCustomerTable.bind(this)
        this.onChangeCustomer = this.onChangeCustomer.bind(this)
        this.isDisableButtons = this.isDisableButtons.bind(this)
    }

    componentDidMount() {
        const path = FrameworkUtils.matchPath(window.location.pathname, RouteConstant.CART_DETAIL)
        if (path) {
            this.requestApi((path.params as IParams).id)
        }

        this.customerApiService.all()
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        customers: response.data.data as ICustomerModel[]
                    })
                }
            })
    }

    requestApi(id: string) {
        this.cartApiService.get(id)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        cartModel: response.data.data as ICartModel,
                        isDone: (response.data.data as ICartModel).status === CartStatus.DONE
                    })
                }
            })
    }

    renderCustomerTable() {
        const tableCell: ITableCellModel[] = []
        if (this.state.cartModel._id) {
            const customer = this.state.cartModel.customer as ICustomerModel
            tableCell.push({
                id: customer._id,
                content: [
                    customer?.name,
                    customer?.address,
                    customer?.tax,
                    customer?.email,
                    customer?.phone_number,
                    customer?.contact_name
                ]
            })
        }
        return tableCell
    }

    onChangeCustomer(id: string) {
        const cartModel: ICartModel = this.state.cartModel
        this.state.customers.forEach(element => {
            if (element._id === id) {
                cartModel.customer = element
                this.setState({
                    cartModel: cartModel
                })
            }
        })
    }

    renderCartItems() {
        let tableCells: ITableCellModel[] = [];
        if (this.state.cartModel.items) {

            (this.state.cartModel.items as ICartItemModel[]).forEach((element: ICartItemModel) => {
                const size = element.size as ISizeModel
                let rowColor = TableRowColor.NONE;
                if (element.source === CartItemSource.WAREHOUSE && !element.warehouse) {
                    rowColor = TableRowColor.DANGER;
                } else if (element.source === CartItemSource.WAREHOUSE && element.warehouse && (element.amount - element.delivered) > (element.warehouse as IWarehouseModel).amount) {
                    rowColor = TableRowColor.WARNING;
                }
                
                if (element.delivered === element.amount || element.status === CartItemStatus.DONE) {
                    rowColor = TableRowColor.SUCCESS;
                }

                tableCells.push({
                    id: element._id,
                    color: rowColor,
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
                        element.total_price?.toLocaleString()
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
        }

        return tableCells
    }

    redirectEditSize(id: string) {
        this.props.appUrlContext.redirectTo(RouteConstant.CART_ITEM + id)
    }

    deleteSize(id: string) {
        const cartModel: ICartModel = this.state.cartModel;
        (cartModel.items as ICartItemModel[]).forEach((element, index) => {
            if (id === element._id) {
                cartModel.items.splice(index, 1)
            }
        })

        this.setState({
            cartModel: cartModel
        }, () => {
            this.onUpdateCart()
        })
    }

    onDeleteCart() {
        this.cartApiService.delete(this.state.cartModel._id)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS),
                        content: this.props.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS_DETAIL)
                    })
                    this.props.appUrlContext.back()
                    this.props.cartContext.current.onRefresh()
                } else {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.CANNOT_DELETE),
                        content: this.props.languageContext.current.getMessageString(MessageId.CANNOT_DELETE_DETAIL)
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

    onUpdateCart() {
        let canUpdateCart = true;
        if (this.cartStatusRef.current.getValue() === CartItemStatus.DONE) {
            let canUpdate = true;

            (this.state.cartModel.items as ICartItemModel[]).forEach(element => {
                if (element.source === CartItemSource.WAREHOUSE) {
                    if (!element.warehouse || element.delivered < (element.warehouse as IWarehouseModel)?.amount) {
                        canUpdate = false;
                        canUpdateCart = false;
                    }
                }
            })

            if (canUpdate) {
                (this.state.cartModel.items as ICartItemModel[]).forEach(element => {
                    if (element.status !== CartItemStatus.DONE) {
                        this.cartItemApiService.update(element._id, {
                            status: CartItemStatus.DONE,
                        } as ICartItemModel)
    
                        if (element.source === CartItemSource.WAREHOUSE) {
                            this.warehouseApiService.update((element.warehouse as IWarehouseModel)._id, {
                                amount: ((element.warehouse as IWarehouseModel).amount - element.delivered)
                            } as IWarehouseModel)
                        }
                    }
                })
            } else {
                this.props.appDialogContext.addDialog({
                    title: this.props.languageContext.current.getMessageString(MessageId.NOT_ENOUGH),
                    content: this.props.languageContext.current.getMessageString(MessageId.NOT_ENOUGH_CONTENT),
                });
            }
        }

        if (!canUpdateCart) {
            return;
        }

        this.cartApiService.update(this.state.cartModel._id, this.state.cartModel)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS),
                        content: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS_DETAIL)
                    })
                    this.requestApi(this.state.cartModel._id)
                    this.props.cartContext.current.onRefresh()
                } else {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE),
                        content: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE_DETAIL)
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

    cartStatusOnChange(id: string) {
        const cartModel = this.state.cartModel
        cartModel.status = id as CartStatus
        this.setState({
            cartModel: cartModel
        })
    }

    isDisableButtons() : boolean {
        if (this.state.isDone) {
            return true;
        }
        
        return !((this.state.cartModel.createdBy as IUserModel)?._id === this.props.userLoginContext.state.user?._id || this.props.userLoginContext.state.user?.role === UserRole.ADMIN)
    }

    render() {
        return <FrameworkComponents.BasePage {...{
            title: this.props.languageContext.current.getMessageString(MessageId.CART_DETAIL)
        }}>
            <FrameworkComponents.FormGroup>
                <FrameworkComponents.SelectBox
                    placeHolder={this.props.languageContext.current.getMessageString(MessageId.CHANGE_CUSTOMER)}
                    options={AppRenderUtils.renderCustomerSelectBox(this.state.customers)}
                    onChanged={this.onChangeCustomer}
                    selectedId={(this.state.cartModel.customer as ICustomerModel)?._id} />
            </FrameworkComponents.FormGroup>
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
            <FrameworkComponents.FormGroup>
                <FrameworkComponents.SelectBox
                    placeHolder={this.props.languageContext.current.getMessageString(MessageId.CART_STATUS)}
                    options={AppRenderUtils.renderCartStatusSelectBox(this.props.languageContext)}
                    selectedId={this.state.cartModel.status}
                    onChanged={this.cartStatusOnChange}
                    ref={this.cartStatusRef} />
            </FrameworkComponents.FormGroup>
            <FrameworkComponents.FormGroup>
                <FrameworkComponents.Button
                    type={ButtonTypeConstant.DANGER}
                    dialogModel={{
                        title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE),
                        content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE_DETAIL)
                    }}
                    disable={this.isDisableButtons()}
                    onClick={this.onDeleteCart}>
                    {this.props.languageContext.current.getMessageString(MessageId.DELETE)}
                </FrameworkComponents.Button>
                <FrameworkComponents.Button
                    type={ButtonTypeConstant.PRIMARY}
                    dialogModel={{
                        title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE),
                        content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE_DETAIL)
                    }}
                    onClick={this.onUpdateCart}
                    disable={this.isDisableButtons()}>
                    {this.props.languageContext.current.getMessageString(MessageId.UPDATE)}
                </FrameworkComponents.Button>
            </FrameworkComponents.FormGroup>
        </FrameworkComponents.BasePage>
    }
}

export default WithFramework.withLanguage(
    WithFramework.withAppDialog(
        WithFramework.withUserLogin(
            WithFramework.withAppUrl(
                WithCart(CartDetail)
            )
        )
    )
)