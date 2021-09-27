import CartApiService from "app/api/CartApiService"
import CustomerApiService from "app/api/CustomerApiService"
import ICartContext from "app/context/cart/ICartContext"
import WithCart from "app/context/cart/WithCart"
import ICartModel from "app/documents/ICartModel"
import ICustomerModel from "app/documents/ICustomerModel"
import FrameworkComponents from "framework/components/FrameworkComponents"
import { CartStatus, TableRowColor } from "framework/constants/AppEnumConstant"
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

const HIDEN_TEXT = "***************"

interface CartCreateProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    userLoginContext: IUserLoginContext;
    appUrlContext: IAppUrlContext;
    cartContext: ICartContext
}

interface CartCreateState {
    customers: ICustomerModel[],
    customerSelected: string
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
            customers: [],
            customerSelected: ''
        }

        this.onCancel = this.onCancel.bind(this)
        this.onRegistration = this.onRegistration.bind(this)
        this.tableContent = this.tableContent.bind(this)
        this.chooseCustomer = this.chooseCustomer.bind(this)
        this.canShowInfo = this.canShowInfo.bind(this)
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
        if (!FrameworkUtils.isBlank(this.state.customerSelected)) {
            const cartModel: ICartModel = {
                customer: this.state.customerSelected,
                items: [] as string[],
                status: CartStatus.DISCUSS
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
        } else {
            this.props.appDialogContext.addDialog({
                title: this.props.languageContext.current.getMessageString(MessageId.CUSTOMERS),
                content: this.props.languageContext.current.getMessageString(MessageId.NEED_CHOOSE_CUSTOMER)
            })
        }
    }

    onCancel() {
        FrameworkUtils.formClear(this.cartCreateFormRef)
    }

    tableContent(): ITableCellModel[] {
        let tableContents: ITableCellModel[] = [];

        this.state.customers.forEach(element => {
            let rowColor: TableRowColor = TableRowColor.NONE;

            if (this.state.customerSelected === element._id) {
                rowColor = TableRowColor.SUCCESS;
            }

            const createdById = (element.createdBy as IUserModel)._id;

			tableContents.push({
				id: element._id,
                color: rowColor,
				content: [
					element.name,
					element.address,
					this.canShowInfo(createdById) ? element.tax : HIDEN_TEXT,
					this.canShowInfo(createdById) ? element.email : HIDEN_TEXT,
					this.canShowInfo(createdById) ? element.phone_number : HIDEN_TEXT,
					this.canShowInfo(createdById) ? element.contact_name : HIDEN_TEXT,
					FrameworkUtils.userName(element.createdBy)
				],
				action: {
					choose: {
                        isAlive: this.canShowInfo(createdById),
                        func: this.chooseCustomer
                    }
				}
			})
		})

        return tableContents;
    }

    canShowInfo(userId: string) {
		return userId === this.props.userLoginContext.state.user?._id || this.props.userLoginContext.state.user?.role === UserRole.ADMIN;
	}

    chooseCustomer(id: string) {
        if (!FrameworkUtils.isBlank(this.state.customerSelected) && this.state.customerSelected === id) {
            this.setState({
                customerSelected: ''
            })
        } else {
            this.setState({
                customerSelected: id
            })
        }
    }

    render() {
        return <FrameworkComponents.BasePage {...{
            title: this.props.languageContext.current.getMessageString(MessageId.CART_CREATE)
        }}>
            <FrameworkComponents.Table 
                title={this.props.languageContext.current.getMessageString(MessageId.CHOOSE_CUSTOMER)}
                header={[
                    this.props.languageContext.current.getMessageString(MessageId.NAME),
                    this.props.languageContext.current.getMessageString(MessageId.ADDRESS),
                    this.props.languageContext.current.getMessageString(MessageId.TAX_CODE),
                    this.props.languageContext.current.getMessageString(MessageId.EMAIL),
                    this.props.languageContext.current.getMessageString(MessageId.PHONE_NUMBER),
                    this.props.languageContext.current.getMessageString(MessageId.CONTACT_NAME),
                    this.props.languageContext.current.getMessageString(MessageId.EMPLOYEE),
                    this.props.languageContext.current.getMessageString(MessageId.ACTION)
                ]}
                content={this.tableContent()}
            />
            <FrameworkComponents.BaseForm>
                {/* <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.CHOOSE_CUSTOMER)}
                        options={AppRenderUtils.renderCustomerSelectBox(this.state.customers)}
                        required={true}
                        ref={this.cartCreateFormRef.customerSelectBox}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)} />
                </FrameworkComponents.FormGroup> */}
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