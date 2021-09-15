import CartApiService from "app/api/CartApiService"
import ICartContext from "app/context/cart/ICartContext"
import WithCart from "app/context/cart/WithCart"
import ICartModel from "app/documents/ICartModel"
import ICustomerModel from "app/documents/ICustomerModel"
import FrameworkComponents from "framework/components/FrameworkComponents"
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode"
import MessageId from "framework/constants/MessageId"
import RouteConstant from "framework/constants/RouteConstant"
import WithFramework from "framework/constants/WithFramework"
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext"
import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import IAppUrlContext from "framework/contexts/url/IAppUrlContext"
import IUserLoginContext from "framework/contexts/user/IUserLoginContext"
import ITableCellModel from "framework/documents/ui/ITableCellModel"
import FrameworkUtils from "framework/utils/FrameworkUtils"
import React from "react"

interface CartsProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    userLoginContext: IUserLoginContext;
    appUrlContext: IAppUrlContext;
    cartContext: ICartContext
}

interface CartsState {
    cartModels: ICartModel[]
}

class Carts extends React.Component<CartsProps, CartsState> {
    private cartApiService: CartApiService
    constructor(props: CartsProps) {
        super(props)

        this.cartApiService = new CartApiService()
        this.state = {
            cartModels: []
        }
        this.renderCartTable = this.renderCartTable.bind(this)
        this.deleteCart = this.deleteCart.bind(this)
        this.editCart = this.editCart.bind(this)
        this.requestCartsApi = this.requestCartsApi.bind(this)
    }

    componentDidMount() {
        if (this.props.userLoginContext.state.user) {
            this.requestCartsApi()
        } else {
            this.props.userLoginContext.current.addEventUserLogin(this.requestCartsApi)
        }
    }

    requestCartsApi() {
        this.cartApiService.all({
            createdBy: this.props.userLoginContext.state.user._id
        })
        .then(response => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.setState({
                    cartModels: response.data.data as ICartModel[]
                })
            }
        })
    }

    renderCartTable(cartModels: ICartModel[]): ITableCellModel[] {
        const tableCells: ITableCellModel[] = []
        cartModels.forEach(element => {
            tableCells.push({
                id: element._id,
                content: [
                    (element?.customer as ICustomerModel)?.name + " - " + FrameworkUtils.generateDate(element.createdAt),
                    (element?.customer as ICustomerModel)?.name,
                    FrameworkUtils.getDisplayNameCartStatus(element.status, this.props.languageContext),
                    FrameworkUtils.generateDate(element.createdAt)
                ],
                action: {
                    delete: {
                        isAlive: true,
                        func: this.deleteCart,
                        dialog: {
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE_DETAIL)
                        }
                    },
                    edit: {
                        isAlive: true,
                        func: this.editCart
                    }
                }
            })
        })
        return tableCells
    }

    editCart(id: string) {
        this.props.appUrlContext.redirectTo(RouteConstant.CARTS + id)
    }

    deleteCart(id: string) {
        this.cartApiService.delete(id)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS),
                        content: this.props.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS_DETAIL)
                    })
                    this.requestCartsApi()
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

    render() {
        return <FrameworkComponents.BasePage {...{
            title: this.props.languageContext.current.getMessageString(MessageId.CARTS)
        }}>
            <FrameworkComponents.Table {...{
                header: [
                    this.props.languageContext.current.getMessageString(MessageId.NAME),
                    this.props.languageContext.current.getMessageString(MessageId.CUSTOMERS),
                    this.props.languageContext.current.getMessageString(MessageId.CART_STATUS),
                    this.props.languageContext.current.getMessageString(MessageId.CREATED_TIME),
                    this.props.languageContext.current.getMessageString(MessageId.ACTION)
                ],
                content: this.renderCartTable(this.state.cartModels),
                commonButton: () => {
                    this.props.appUrlContext.redirectTo(RouteConstant.CART_CREATE)
                }
            }} />
        </FrameworkComponents.BasePage>
    }
}

export default WithFramework.withLanguage(
    WithFramework.withAppDialog(
        WithFramework.withUserLogin(
            WithFramework.withAppUrl(
                WithCart(Carts)
            )
        )
    )
)