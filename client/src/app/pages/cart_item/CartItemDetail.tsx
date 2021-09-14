import CartItemApiService from "app/api/CartItemApiService";
import WarehouseApiService from "app/api/WarehouseApiService";
import ICartContext from "app/context/cart/ICartContext";
import WithCart from "app/context/cart/WithCart";
import ICartItemModel from "app/documents/ICartItemModel";
import IProductNameModel from "app/documents/IProductNameModel";
import IProductTypeModel from "app/documents/IProductTypeModel";
import ISizeModel from "app/documents/ISizeModel";
import IStandardModel from "app/documents/IStandardModel";
import ISystemStandardModel from "app/documents/ISystemStandardModel";
import IWarehouseModel from "app/documents/IWarehouseModel";
import AppRenderUtils from "app/utils/AppRenderUtils";
import AppUtils from "app/utils/AppUtils";
import FrameworkComponents from "framework/components/FrameworkComponents";
import IFormInputElement from "framework/components/IFormInputElement";
import AppConstant from "framework/constants/AppConstant";
import { CartItemSource, CartItemStatus } from "framework/constants/AppEnumConstant";
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant";
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode";
import MessageId from "framework/constants/MessageId";
import RouteConstant from "framework/constants/RouteConstant";
import RuleConstant from "framework/constants/RuleConstant";
import WithFramework from "framework/constants/WithFramework";
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import IAppUrlContext from "framework/contexts/url/IAppUrlContext";
import IUserLoginContext from "framework/contexts/user/IUserLoginContext";
import Rule from "framework/documents/models/Rule";
import ITableCellModel from "framework/documents/ui/ITableCellModel";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import React from "react";

interface ICartItemDetailProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    userLoginContext: IUserLoginContext;
    appUrlContext: IAppUrlContext;
    cartContext: ICartContext;
}

interface ICartItemDetailState {
    cartItem: ICartItemModel;
}

interface IParams {
    id: string;
}

interface ICartItemFormRef {
    delivered: React.RefObject<any>;
    status: React.RefObject<any>;
}

class CartItemDetail extends React.Component<ICartItemDetailProps, ICartItemDetailState> {
    private cartItemApiService: CartItemApiService;
    private warehouseApiService: WarehouseApiService;
    private cartItemFormRef: ICartItemFormRef;

    constructor(props: ICartItemDetailProps) {
        super(props);

        this.cartItemFormRef = {
            delivered: React.createRef<IFormInputElement>(),
            status: React.createRef<IFormInputElement>()
        }
        this.cartItemApiService = new CartItemApiService();
        this.warehouseApiService = new WarehouseApiService();
        this.state = {
            cartItem: {} as ICartItemModel,
        };

        this.onUpdate = this.onUpdate.bind(this);
        this.requestApi = this.requestApi.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
    }

    componentDidMount() {
        const path = FrameworkUtils.matchPath(window.location.pathname, RouteConstant.CART_ITEM_DETAIL);

        if (path) {
            this.requestApi((path.params as IParams).id);
        }
    }

    requestApi(id: string) {
        this.cartItemApiService.get(id).then((response) => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.setState({
                    cartItem: response.data.data as ICartItemModel,
                });
            }
        });
    }

    renderHeader() {
        return [
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
            this.props.languageContext.current.getMessageString(MessageId.TOTAL_AMOUNT)
        ];
    }

    renderContent(): ITableCellModel[] {
        const tableCells: ITableCellModel[] = [];
        if (this.state.cartItem._id) {
            const size = this.state.cartItem.size as ISizeModel;
            tableCells.push({
                id: this.state.cartItem._id,
                content: [
                    (this.state.cartItem.product_type as IProductTypeModel)?.name,
                    (this.state.cartItem.product_name as IProductNameModel)?.name,
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
                    (this.state.cartItem.system_standard as ISystemStandardModel)?.name,
                    (this.state.cartItem.standard as IStandardModel)?.name,
                    this.state.cartItem.amount?.toString(),
                    this.state.cartItem.unit_price?.toLocaleString(),
                    FrameworkUtils.getDisplayNameDiscountType(this.state.cartItem.discount_type, this.props.languageContext),
                    this.state.cartItem.discount_percent?.toString(),
                    this.state.cartItem.total_price?.toLocaleString(),
                ],
            });
        }
        return tableCells;
    }

    onUpdate() {
        if (FrameworkUtils.validateFrom(this.cartItemFormRef)) {
            const warehouse: IWarehouseModel = (this.state.cartItem.warehouse as IWarehouseModel);
            let delivered = parseFloat(this.cartItemFormRef.delivered.current.getValue());

            if (delivered < this.state.cartItem.delivered) {
                this.props.appDialogContext.addDialog({
                    title: this.props.languageContext.current.getMessageString(MessageId.CAN_NOT_UPDATE_DELIVERY),
                    content: this.props.languageContext.current.getMessageString(MessageId.CAN_NOT_UPDATE_DELIVERY_CONTENT),
                })
                this.cartItemFormRef.delivered.current.setErrorMessage(
                    this.props.languageContext.current.getMessageString(MessageId.SOMETHING_WRONG)
                )
                return false;
            }

            if (delivered > this.state.cartItem.amount) {
                this.props.appDialogContext.addDialog({
                    title: this.props.languageContext.current.getMessageString(MessageId.DELIVERY_MORE_AMOUNT),
                    content: this.props.languageContext.current.getMessageString(MessageId.DELIVERY_MORE_AMOUNT_CONTENT)
                })
                this.cartItemFormRef.delivered.current.setErrorMessage(
                    this.props.languageContext.current.getMessageString(MessageId.SOMETHING_WRONG)
                )
                return false;
            }

            if ( warehouse && (delivered - this.state.cartItem.delivered) > warehouse.amount) {
                this.props.appDialogContext.addDialog({
                    title: this.props.languageContext.current.getMessageString(MessageId.NOT_ENOUGH),
                    content: this.props.languageContext.current.getMessageString(MessageId.NOT_ENOUGH_CONTENT),
                });
            } else {
                if (warehouse && this.cartItemFormRef.status.current.getValue() === CartItemStatus.DONE) {
                    delivered = this.state.cartItem.amount;

                    this.warehouseApiService.update(warehouse._id, {
                        amount: (warehouse.amount - delivered)
                    } as IWarehouseModel)
                    .then(res => {
                        this.props.cartContext.current.onRefresh();
                    })

                    this.cartItemFormRef.delivered.current.setValue(this.state.cartItem.delivered)
                }

                if (this.state.cartItem.source === CartItemSource.WAREHOUSE && delivered > this.state.cartItem.delivered) {
                    this.warehouseApiService.update(warehouse._id, {
                        amount: (warehouse.amount - (delivered - this.state.cartItem.delivered))
                    } as IWarehouseModel)
                }

                this.cartItemApiService.update(this.state.cartItem._id,{
                    delivered: delivered,
                    status: this.cartItemFormRef.status.current.getValue()
                } as ICartItemModel)
                .then(response => {
                    this.props.cartContext.current.onRefresh();
                    
                    if (response.status === HttpRequestStatusCode.OK) {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS),
                            content: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS_DETAIL)
                        })
                        this.requestApi(this.state.cartItem._id)
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
        }
    }

    render() {
        return (
            <FrameworkComponents.BasePage
                {...{
                    title: this.props.languageContext.current.getMessageString(MessageId.CART_ITEM_DETAIL),
                }}
            >
                <FrameworkComponents.Table header={this.renderHeader()} content={this.renderContent()} />
                <FrameworkComponents.BaseForm>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.SOURCE)}
                            readOnly={true}
                            value={AppUtils.sourceTitle(this.props.languageContext, this.state.cartItem.source)} />
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.DELIVERY)}
                            value={this.state.cartItem.delivered}
                            ref={this.cartItemFormRef.delivered}
                            validate={[
                                new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE),
                                new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_NUMBER, new RegExp(AppConstant.ONLY_NUMBER_REGEXP)),
                            ]}
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.SelectBox
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.CART_STATUS)}
                            options={AppRenderUtils.renderCartItemStatus(this.props.languageContext)}
                            selectedId={this.state.cartItem.status}
                            required={true}
                            ref={this.cartItemFormRef.status}
                            errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.Button type={ButtonTypeConstant.PRIMARY}
                            onClick={this.onUpdate}
                            disable={!this.state.cartItem._id || this.state.cartItem.status === CartItemStatus.DONE}
                            dialogModel={{
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE_DETAIL)
                        }}>
                            {this.props.languageContext.current.getMessageString(MessageId.UPDATE)}
                        </FrameworkComponents.Button>
                    </FrameworkComponents.FormGroup>
                </FrameworkComponents.BaseForm>
            </FrameworkComponents.BasePage>
        );
    }
}

export default WithFramework.withLanguage(WithFramework.withAppDialog(WithFramework.withUserLogin(WithFramework.withAppUrl(WithCart(CartItemDetail)))));
