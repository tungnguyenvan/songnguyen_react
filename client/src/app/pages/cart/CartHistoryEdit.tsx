import CartApiService from "app/api/CartApiService"
import ICartContext from "app/context/cart/ICartContext"
import ICartModel from "app/documents/ICartModel"
import FrameworkComponents from "framework/components/FrameworkComponents"
import { CartStatusHistoryItem } from "framework/constants/AppEnumConstant"
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant"
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode"
import MessageId from "framework/constants/MessageId"
import RouteConstant from "framework/constants/RouteConstant"
import WithFramework from "framework/constants/WithFramework"
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext"
import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import IAppUrlContext from "framework/contexts/url/IAppUrlContext"
import IUserLoginContext from "framework/contexts/user/IUserLoginContext"
import FrameworkUtils from "framework/utils/FrameworkUtils"
import React from "react"

interface CartHistoryEditProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    userLoginContext: IUserLoginContext;
    appUrlContext: IAppUrlContext;
    cartContext: ICartContext
}

interface CartHistoryEditState {
    cartModel: ICartModel;
    cartHistory: CartStatusHistoryItem;
}

interface LocationProps {
    cart_id: string,
    history_id: string,
}

class CartHistoryEdit extends React.Component<CartHistoryEditProps, CartHistoryEditState> {
    private cartApiService: CartApiService;
    private noteRef: React.RefObject<any>;
    
    constructor(props: CartHistoryEditProps) {
        super(props);

        this.cartApiService = new CartApiService();

        this.state = {
            cartModel: {} as ICartModel,
            cartHistory: {} as CartStatusHistoryItem
        }
        this.noteRef = React.createRef<any>();

        this.onUpdateNote = this.onUpdateNote.bind(this)
    }

    componentDidMount() {
        const path = FrameworkUtils.matchPath(window.location.pathname, RouteConstant.CART_HISTORY_EDIT);

        if (path) {
            const params: LocationProps = path.params as LocationProps;

            if (params.cart_id && params.history_id) {
                this.cartApiService.get(params.cart_id)
                    .then(response => {
                        if (response.status === HttpRequestStatusCode.OK) {
                            this.setState({
                                cartModel: response.data.data as ICartModel
                            }, () => {
                                this.state.cartModel.history.forEach(element => {
                                    if (element._id === params.history_id) {
                                        this.setState({
                                            cartHistory: element
                                        })
                                    }
                                })
                            })
                        }
                    })
            } else {
                if (this.props.appUrlContext.canBack()) {
                    this.props.appUrlContext.back()
                } else {
                    this.props.appUrlContext.redirectTo(RouteConstant.DASHBOARD)
                }
            }
        } else {
            if (this.props.appUrlContext.canBack()) {
                this.props.appUrlContext.back()
            } else {
                this.props.appUrlContext.redirectTo(RouteConstant.DASHBOARD)
            }
        }
    }

    onUpdateNote() {
        const cartModel = this.state.cartModel;
        cartModel.history.forEach(element => {
            if (element._id === this.state.cartHistory._id) {
                element.note = this.noteRef.current.getValue()
            }
        })

        this.cartApiService.update(this.state.cartModel._id, cartModel)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS),
                        content: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS_DETAIL)
                    })

                    if (this.props.appUrlContext.canBack()) {
                        this.props.appUrlContext.back()
                    } else {
                        this.props.appUrlContext.redirectTo(RouteConstant.DASHBOARD)
                    }
                } else {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE),
                        content: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE_DETAIL)
                    })
                }
            }).catch(error => {
                this.props.appDialogContext.addDialog({
                    title: this.props.languageContext.current.getMessageString(MessageId.SERVER_ERROR),
                    content: this.props.languageContext.current.getMessageString(MessageId.SERVER_ERROR_CONTENT)
                })
            })
    }

    render() {
        return <FrameworkComponents.BasePage {...{
            title: this.props.languageContext.current.getMessageString(MessageId.EIDT_CART_HISTORY)
        }}>
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        ref={this.noteRef}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.NOTE)}
                        value={this.state.cartHistory.note} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.PRIMARY}
                        dialogModel={{
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE_DETAIL)
                        }}
                        onClick={this.onUpdateNote}>
                        {this.props.languageContext.current.getMessageString(MessageId.UPDATE)}</FrameworkComponents.Button>
                </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>
        </FrameworkComponents.BasePage>
    }
}

export default WithFramework.withLanguage(
    WithFramework.withAppDialog(
        WithFramework.withUserLogin(
            WithFramework.withAppUrl(
                CartHistoryEdit
            )
        )
    )
)