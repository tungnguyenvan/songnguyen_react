import CartApiService from "app/api/CartApiService"
import CustomerApiService from "app/api/CustomerApiService"
import ICartContext from "app/context/cart/ICartContext"
import WithCart from "app/context/cart/WithCart"
import ICartModel from "app/documents/ICartModel"
import ICustomerModel from "app/documents/ICustomerModel"
import AppRenderUtils from "app/utils/AppRenderUtils"
import FrameworkComponents from "framework/components/FrameworkComponents"
import { CartStatus } from "framework/constants/AppEnumConstant"
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

interface CartCreateProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    userLoginContext: IUserLoginContext;
    appUrlContext: IAppUrlContext;
    cartContext: ICartContext
}

interface CartCreateState {
    customers: ICustomerModel[]
}

interface ICartCreateFormRef {
    customerSelectBox: React.RefObject<any>
}

class CartCreate extends React.Component<CartCreateProps, CartCreateState> {
    private customerApiService: CustomerApiService
    private cartCreateFormRef: ICartCreateFormRef
    private cartApiService: CartApiService

    constructor(props: CartCreateProps) {
        super(props)

        this.cartCreateFormRef = {
            customerSelectBox: React.createRef<any>()
        }
        this.customerApiService = new CustomerApiService()
        this.cartApiService = new CartApiService()
        this.state = {
            customers: []
        }

        this.onCancel = this.onCancel.bind(this)
        this.onRegistration = this.onRegistration.bind(this)
    }

    componentDidMount() {
        this.customerApiService.all()
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        customers: response.data.data as ICustomerModel[]
                    })
                }
            })
    }

    onRegistration() {
        if (FrameworkUtils.validateFrom(this.cartCreateFormRef)) {
            const cartModel: ICartModel = {
                customer: this.cartCreateFormRef.customerSelectBox.current.getValue(),
                items: [] as string[],
                status: CartStatus.DICUSS
            } as ICartModel

            this.cartApiService.save(cartModel)
                .then(response => {
                    if (response.status === HttpRequestStatusCode.CREATED) {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS),
                            content: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS_CONTENT)
                        })

                        this.props.cartContext.current.onRefresh()
                        this.props.appUrlContext.redirectTo(RouteConstant.CARTS + (response.data.data as ICartModel)._id)
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

    onCancel() {
        FrameworkUtils.formClear(this.cartCreateFormRef)
    }

    render() {
        return <FrameworkComponents.BasePage {...{
            title: this.props.languageContext.current.getMessageString(MessageId.CART_CREATE)
        }}>
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.CHOOSE_CUSTOMER)}
                        options={AppRenderUtils.renderCustomerSelectBox(this.state.customers)}
                        required={true}
                        ref={this.cartCreateFormRef.customerSelectBox}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)} />
                </FrameworkComponents.FormGroup>
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
        WithFramework.withUserLogin(
            WithFramework.withAppUrl(
                WithCart(CartCreate)
            )
        )
    )
)