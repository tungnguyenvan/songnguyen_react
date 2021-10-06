import CartApiService from "app/api/CartApiService";
import CartItemApiService from "app/api/CartItemApiService";
import SizeApiService from "app/api/SizeApiService";
import WarehouseApiService from "app/api/WarehouseApiService";
import ICartContext from "app/context/cart/ICartContext";
import WithCart from "app/context/cart/WithCart";
import ICartItemModel from "app/documents/ICartItemModel";
import ICartModel from "app/documents/ICartModel";
import IProductNameModel from "app/documents/IProductNameModel";
import IProductTypeModel from "app/documents/IProductTypeModel";
import ISizeModel from "app/documents/ISizeModel";
import IStandardModel from "app/documents/IStandardModel";
import ISystemStandardModel from "app/documents/ISystemStandardModel";
import IThicknessModel from "app/documents/IThicknessModel";
import IWarehouseModel from "app/documents/IWarehouseModel";
import AppRenderUtils from "app/utils/AppRenderUtils";
import FrameworkComponents from "framework/components/FrameworkComponents";
import IFormInputElement from "framework/components/IFormInputElement";
import AppConstant from "framework/constants/AppConstant";
import { CartItemSource, CartItemStatus, DiscountType, FormType, GasketPTCShape } from "framework/constants/AppEnumConstant";
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

// const OUTER_EXTRAS = 1.1;
// const MIN_INNER_DIAMETER = 115;

interface WarehouseItemProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    appUrlContext: IAppUrlContext;
    userLoginContext: IUserLoginContext;
    cartContext: ICartContext;
}

interface WarehouseItemState {
    warehouse: IWarehouseModel;
    unitPrice: number;
    totalAmount: number;
}

interface IWarehouseItemFormRef {
    amount: React.RefObject<any>;
    discountType: React.RefObject<any>;
    percent: React.RefObject<any>;
    unitPrice: React.RefObject<any>;
    totalAmount: React.RefObject<any>;
}

interface IExportWarehouseFormRef {
    amount: React.RefObject<any>;
}

interface IParams {
    id: string;
}

class WarehouseItem extends React.Component<WarehouseItemProps, WarehouseItemState> {
    private warehouseApiService: WarehouseApiService;
    private warehouseItemFormRef: IWarehouseItemFormRef;
    private cartItemApiService: CartItemApiService;
    private cartItemCalculated: ICartItemModel;
    private cartApiService: CartApiService;
    private sizeModelCalculated: ISizeModel;
    private sizeApiService: SizeApiService;
    private exportWarehouseFormRef: IExportWarehouseFormRef;
    private importWarehouseFormRef: IExportWarehouseFormRef;

    constructor(props: WarehouseItemProps) {
        super(props);

        this.warehouseItemFormRef = {
            amount: React.createRef<IFormInputElement>(),
            discountType: React.createRef<IFormInputElement>(),
            percent: React.createRef<IFormInputElement>(),
            unitPrice: React.createRef<IFormInputElement>(),
            totalAmount: React.createRef<IFormInputElement>(),
        };

        this.exportWarehouseFormRef = {
            amount: React.createRef<IFormInputElement>()
        }

        this.importWarehouseFormRef = {
            amount: React.createRef<IFormInputElement>()
        }

        this.cartItemCalculated = undefined as unknown as ICartItemModel;
        this.sizeModelCalculated = undefined as unknown as ISizeModel;
        this.warehouseApiService = new WarehouseApiService();
        this.sizeApiService = new SizeApiService();
        this.cartItemApiService = new CartItemApiService();
        this.cartApiService = new CartApiService();
        this.state = {
            warehouse: {} as IWarehouseModel,
            unitPrice: 0,
            totalAmount: 0,
        };

        this.onImportWarehouse = this.onImportWarehouse.bind(this);
        this.saveCartItem = this.saveCartItem.bind(this);
        this.addToCart = this.addToCart.bind(this);
        this.requestApi = this.requestApi.bind(this);
        this.onCalculator = this.onCalculator.bind(this);
        this.calculatorForm1 = this.calculatorForm1.bind(this);
        this.calculatorForm2 = this.calculatorForm2.bind(this);
        this.calculatorForm3 = this.calculatorForm3.bind(this);
        this.validateDiscount = this.validateDiscount.bind(this);
        this.renderTableHeader = this.renderTableHeader.bind(this);
        this.onExportWarehouse = this.onExportWarehouse.bind(this);
        this.renderTableContent = this.renderTableContent.bind(this);
    }

    componentDidMount() {
        const path = FrameworkUtils.matchPath(window.location.pathname, RouteConstant.WAREHOUSE_ITEM_DETAIL);
        if (path) {
            this.requestApi((path.params as IParams).id);
        }
    }

    requestApi(id: string) {
        this.warehouseApiService.get(id).then((response) => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.setState({
                    warehouse: response.data.data as IWarehouseModel,
                });
            }
        });
    }

    renderTableHeader(): string[] {
        return [
            this.props.languageContext.current.getMessageString(MessageId.PRODUCT_TYPE),
            this.props.languageContext.current.getMessageString(MessageId.PRODUCT_NAME),
            this.props.languageContext.current.getMessageString(MessageId.THICKNESS),
            this.props.languageContext.current.getMessageString(MessageId.AMOUNT),
            this.props.languageContext.current.getMessageString(MessageId.SYSTEM_STANDARD),
            this.props.languageContext.current.getMessageString(MessageId.STANDARD),
            this.props.languageContext.current.getMessageString(MessageId.SIZE),
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
        ];
    }

    renderTableContent(): ITableCellModel[] {
        const tableCells: ITableCellModel[] = [];

        if (this.state.warehouse._id) {
            const size: ISizeModel = this.state.warehouse.size as ISizeModel;
            tableCells.push({
                id: this.state.warehouse._id,
                content: [
                    (this.state.warehouse.product_type as IProductTypeModel)?.name,
                    (this.state.warehouse.product_name as IProductNameModel)?.name,
                    (this.state.warehouse.thickness as IThicknessModel)?.name,
                    this.state.warehouse.amount?.toString(),
                    (this.state.warehouse.system_standard as ISystemStandardModel)?.name,
                    (this.state.warehouse.standard as IStandardModel)?.name,
                    size?.name,
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
                ],
            });
        }

        return tableCells;
    }

    onCalculator() {
        if (FrameworkUtils.validateFrom(this.warehouseItemFormRef) && this.validateDiscount()) {
            const sizeModel: ISizeModel = this.state.warehouse.size as ISizeModel;
            if (sizeModel) {
                switch (sizeModel.form_type) {
                    case FormType.FORM_1: {
                        this.calculatorForm1(sizeModel);
                        break;
                    }
                    case FormType.FORM_2: {
                        this.calculatorForm2(sizeModel);
                        break;
                    }
                    case FormType.FORM_3: {
                        this.calculatorForm3(sizeModel);
                        break;
                    }
                }
            }
        }
    }

    calculatorForm1(sizeModel: ISizeModel) {
        const discountPercent = this.warehouseItemFormRef.percent.current.getValue() as number;
        const discountType = this.warehouseItemFormRef.discountType.current.getValue() as DiscountType;

        let amount = parseFloat(this.warehouseItemFormRef.amount.current.getValue());
        let m2Price = (this.state.warehouse.thickness as IThicknessModel).price;

        let coreDiscount = 0;
        if (sizeModel.inner_diameter > 100) {
            coreDiscount = 3.14 * Math.pow(sizeModel.inner_diameter - 5, 2) / 4
        }

        let materialPrice = (3.14 * (sizeModel.outer_diameter + sizeModel.inner_diameter + 20) * 10);
        materialPrice = parseInt(materialPrice.toFixed(0), 10);
        let unitPrice = (Math.pow(sizeModel.outer_diameter + 5, 2) - coreDiscount) / 1000000 * m2Price + materialPrice + (sizeModel.hole_count * 500)
        unitPrice = parseInt(unitPrice.toFixed(0), 10);

        // this.warehouseItemFormRef.form.current.setMaterialPrice(parseInt(
        //     ((Math.pow(sizeModel.outer_diameter + 5, 2) - coreDiscount) / 1000000 * m2Price).toFixed(0), 10
        // ))

        this.setState({
            unitPrice: unitPrice
        })

        let totalAmount = unitPrice * amount;
        // calculator discount
        if (discountType === DiscountType.DISCOUNT) {
            totalAmount = totalAmount - (totalAmount * discountPercent) / 100;
        } else if (discountType === DiscountType.INCREASE) {
            totalAmount = totalAmount + (totalAmount * discountPercent) / 100;
        }
        this.setState(
            {
                totalAmount: totalAmount,
            },
            () => {
                this.cartItemCalculated = {
                    product_name: (this.state.warehouse.product_name as IProductNameModel)._id,
                    product_type: (this.state.warehouse.product_type as IProductTypeModel)._id,
                    thickness: (this.state.warehouse.thickness as IThicknessModel)._id,
                    system_standard: (this.state.warehouse.system_standard as ISystemStandardModel)._id,
                    standard: (this.state.warehouse.standard as IStandardModel)._id,
                    size: (this.state.warehouse.size as ISizeModel)._id,
                    delivered: 0,
                    source: CartItemSource.WAREHOUSE,
                    status: CartItemStatus.DISCUSS,
                    warehouse: this.state.warehouse._id,
                    amount: parseFloat(this.warehouseItemFormRef.amount.current.getValue()),
                    unit_price: parseFloat(this.warehouseItemFormRef.unitPrice.current.getValue()),
                    total_price: parseFloat(this.warehouseItemFormRef.totalAmount.current.getValue()),
                    discount_type: this.warehouseItemFormRef.discountType.current.getValue(),
                    discount_percent: parseFloat(this.warehouseItemFormRef.percent.current.getValue()),
                } as ICartItemModel;
            }
        );
    }

    calculatorForm2(sizeModel: ISizeModel) {
        const discountPercent = this.warehouseItemFormRef.percent.current.getValue() as number;
        const discountType = this.warehouseItemFormRef.discountType.current.getValue() as DiscountType;
        let unitPrice = 0;
        let materialPrice = 0;
        let amount = parseFloat(this.warehouseItemFormRef.amount.current.getValue());
        let m2Price = (this.state.warehouse.thickness as IThicknessModel).price

        switch(sizeModel.shape_type) {
            case GasketPTCShape.RF_CIRCLE:
            case GasketPTCShape.FF_CIRCLE: {
                let coreDiscount = 0;
                if (sizeModel.inner_diameter > 100) {
                    coreDiscount = 3.14 * Math.pow(sizeModel.inner_diameter - 5, 2) / 4
                }

                materialPrice = (3.14 * (sizeModel.outer_diameter + sizeModel.inner_diameter + 20) * 10);
                materialPrice = parseInt(materialPrice.toFixed(0), 10);
                unitPrice = (Math.pow(sizeModel.outer_diameter + 5, 2) - coreDiscount) / 1000000 * m2Price + materialPrice + (sizeModel.hole_count * 500)
                unitPrice = parseInt(unitPrice.toFixed(0), 10);
                break
            }
            case GasketPTCShape.RF_RECTANGLE:
            case GasketPTCShape.FF_RECTANGLE: {
                let coreDiscount = 0;
                if (sizeModel.lt > 100 && sizeModel.lt > 100) {
                    coreDiscount = (sizeModel.lt - 5) * (sizeModel.wt - 5)
                }

                materialPrice = (sizeModel.wn + sizeModel.ln + sizeModel.wt + sizeModel.lt + 20) * 10
                materialPrice = parseInt(materialPrice.toFixed(0), 10);
                unitPrice = (((sizeModel.ln + 5) * (sizeModel.wn + 5) - coreDiscount) / 1000000) * m2Price + materialPrice + (sizeModel.hole_count * 500);
                unitPrice = parseInt(unitPrice.toFixed(0), 10);
                break;
            }
            case GasketPTCShape.FF_MANHOLE: {
                let coreDiscount = 0;
                if (sizeModel.ir > 100) {
                    coreDiscount = (2 * 3.14 * sizeModel.ir + (sizeModel.ln - 2 * sizeModel.ir) * sizeModel.ir)
                }

                materialPrice = ((sizeModel.ln + 5) + (sizeModel.wn + 5) + coreDiscount) * 10;
                materialPrice = parseInt(materialPrice.toFixed(0), 10);
                unitPrice = (((sizeModel.ln + 5) * (sizeModel.wn + 5) - (3.14 * Math.pow(sizeModel.ir, 2) + (sizeModel.ln - 2 * sizeModel.ir) * sizeModel.ir)) / 1000000) * m2Price + materialPrice + (sizeModel.hole_count * 500)
                unitPrice = parseInt(unitPrice.toFixed(0), 10);
                break
            }
        }
        console.log(unitPrice);

        // re-calculator in form 2
        switch(sizeModel.shape_type) {
            case GasketPTCShape.RF_CIRCLE:
            case GasketPTCShape.FF_CIRCLE: {
                // this.warehouseItemFormRef.form.current.setMaterialPrice(parseFloat(materialPrice.toFixed(0)))
                break
            }
            case GasketPTCShape.FF_RECTANGLE:
            case GasketPTCShape.FF_MANHOLE:
            case GasketPTCShape.RF_RECTANGLE: {
                // this.warehouseItemFormRef.form.current.setMaterialPrice(
                //     parseFloat(materialPrice.toFixed(0))
                // )
            }
        }

        this.setState({
            unitPrice: unitPrice
        })

        let totalAmount = unitPrice * amount;

        // calculator discount
        if (discountType === DiscountType.DISCOUNT) {
            totalAmount = totalAmount - (totalAmount * discountPercent) / 100;
        } else if (discountType === DiscountType.INCREASE) {
            totalAmount = totalAmount + (totalAmount * discountPercent) / 100;
        }
        this.setState(
            {
                totalAmount: totalAmount,
            },
            () => {
                this.cartItemCalculated = {
                    product_name: (this.state.warehouse.product_name as IProductNameModel)._id,
                    product_type: (this.state.warehouse.product_type as IProductTypeModel)._id,
                    thickness: (this.state.warehouse.thickness as IThicknessModel)._id,
                    amount: parseFloat(this.warehouseItemFormRef.amount.current.getValue()),
                    unit_price: parseFloat(this.warehouseItemFormRef.unitPrice.current.getValue()),
                    total_price: parseFloat(this.warehouseItemFormRef.totalAmount.current.getValue()),
                    discount_type: this.warehouseItemFormRef.discountType.current.getValue(),
                    discount_percent: parseFloat(this.warehouseItemFormRef.percent.current.getValue()),
                    delivered: 0,
                    source: CartItemSource.WAREHOUSE,
                    warehouse: this.state.warehouse._id,
                    status: CartItemStatus.DISCUSS,
                } as ICartItemModel;
            }
        );
    }

    calculatorForm3(sizeModel: ISizeModel) {
        this.sizeModelCalculated = sizeModel;
        const discountPercent = parseFloat(this.warehouseItemFormRef.percent.current.getValue());
        const discountType = this.warehouseItemFormRef.discountType.current.getValue() as DiscountType;

        const dt = sizeModel.wt * sizeModel.lt
        let dtPrice = dt * (this.state.warehouse.thickness as IThicknessModel).price / 1000000;
        dtPrice = parseInt(dtPrice.toFixed(0));
        let totalAmount = dtPrice * parseFloat(this.warehouseItemFormRef.amount.current.getValue())

        this.setState({
            unitPrice: parseInt(dtPrice.toFixed(0), 10)
        })

        // calculator discount
        if (discountType === DiscountType.DISCOUNT) {
            totalAmount = totalAmount - (totalAmount * discountPercent) / 100;
        } else if (discountType === DiscountType.INCREASE) {
            totalAmount = totalAmount + (totalAmount * discountPercent) / 100;
        }
        this.setState(
            {
                totalAmount: totalAmount,
            },
            () => {
                this.cartItemCalculated = {
                    product_name: (this.state.warehouse.product_name as IProductNameModel)._id,
                    product_type: (this.state.warehouse.product_type as IProductTypeModel)._id,
                    thickness: (this.state.warehouse.thickness as IThicknessModel)._id,
                    amount: parseFloat(this.warehouseItemFormRef.amount.current.getValue()),
                    unit_price: parseFloat(this.warehouseItemFormRef.unitPrice.current.getValue()),
                    total_price: parseFloat(this.warehouseItemFormRef.totalAmount.current.getValue()),
                    discount_type: this.warehouseItemFormRef.discountType.current.getValue(),
                    discount_percent: parseFloat(this.warehouseItemFormRef.percent.current.getValue()),
                    delivered: 0,
                    source: CartItemSource.WAREHOUSE,
                    warehouse: this.state.warehouse._id,
                    status: CartItemStatus.DISCUSS,
                } as ICartItemModel;
            }
        );
    }

    validateDiscount() {
        const discountType = this.warehouseItemFormRef.discountType.current.getValue() as DiscountType;
        if (discountType === DiscountType.DISCOUNT || discountType === DiscountType.INCREASE) {
            if (FrameworkUtils.isBlank(this.warehouseItemFormRef.percent.current.getValue())) {
                this.warehouseItemFormRef.percent.current.setErrorMessage(this.props.languageContext.current.getMessageString(MessageId.VALIDATE_NEED_INPUT_PERCENT));
                return false;
            }

            if (!new RegExp(AppConstant.DOUBLE_NUMBER_REGEXP).test(this.warehouseItemFormRef.percent.current.getValue())) {
                this.warehouseItemFormRef.percent.current.setErrorMessage(this.props.languageContext.current.getMessageString(MessageId.VALIDATE_ONLY_FLOAT));
                return false;
            }
        }

        return true;
    }

    addToCart() {
        if (FrameworkUtils.validateFrom(this.warehouseItemFormRef) && this.validateDiscount()) {
            if (this.state.warehouse.amount < this.cartItemCalculated.amount) {
                this.props.appDialogContext.addDialog({
                    title: this.props.languageContext.current.getMessageString(MessageId.NOT_ENOUGH),
                    content: this.props.languageContext.current.getMessageString(MessageId.NOT_ENOUGH_CONTENT),
                });
            } else if (FrameworkUtils.isBlank(this.props.cartContext.current.getIdCartSelected())) {
                this.props.appDialogContext.addDialog({
                    title: this.props.languageContext.current.getMessageString(MessageId.CHOOSE_CART),
                    content: this.props.languageContext.current.getMessageString(MessageId.NEED_CHOOSE_CART)
                })
            } else {
                const formType = (this.state.warehouse.product_type as IProductTypeModel).form_type;

                if (formType === FormType.FORM_1) {
                    this.saveCartItem(this.cartItemCalculated)
                } else {
                    this.sizeModelCalculated._id = undefined as unknown as string;
                    this.sizeApiService.save(this.sizeModelCalculated)
                    .then(response => {
                        if (response.status === HttpRequestStatusCode.CREATED) {
                            this.cartItemCalculated.size = (response.data.data as ISizeModel)._id
                            this.saveCartItem(this.cartItemCalculated)
                        } else {
                            this.props.appDialogContext.addDialog({
                                title: this.props.languageContext.current.getMessageString(MessageId.SERVER_ERROR),
                                content: this.props.languageContext.current.getMessageString(MessageId.SERVER_ERROR_CONTENT)
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
        }
    }

    saveCartItem(cartItem: ICartItemModel) {
        this.cartItemApiService
            .save(cartItem)
            .then((response) => {
                if (response.status === HttpRequestStatusCode.CREATED) {
                    let cartModel: ICartModel = this.props.cartContext.current.getCurrentCart();
                    let items: string[] = [];
                    (cartModel.items as ICartItemModel[]).forEach((element: ICartItemModel) => {
                        items.push(element._id);
                    });
                    items.push((response.data.data as ICartItemModel)._id);
                    cartModel.items = items;
                    this.cartApiService
                        .update(cartModel._id, cartModel)
                        .then((response) => {
                            if (response.status === HttpRequestStatusCode.OK) {
                                this.props.appDialogContext.addDialog({
                                    title: this.props.languageContext.current.getMessageString(MessageId.ADD_TO_CART_SUCCESS),
                                    content: this.props.languageContext.current.getMessageString(MessageId.ADD_TO_CART_SUCCESS_CONTENT),
                                });
                                this.props.cartContext.current.onRefresh();
                                this.props.appUrlContext.back();
                            } else {
                                this.props.appDialogContext.addDialog({
                                    title: this.props.languageContext.current.getMessageString(MessageId.ADD_TO_CART_FAILED),
                                    content: this.props.languageContext.current.getMessageString(MessageId.ADD_TO_CART_FAILED_CONTENT),
                                });
                            }
                        })
                        .catch((error) => {
                            this.props.appDialogContext.addDialog({
                                title: this.props.languageContext.current.getMessageString(MessageId.ADD_TO_CART_FAILED),
                                content: this.props.languageContext.current.getMessageString(MessageId.ADD_TO_CART_FAILED_CONTENT),
                            });
                        });
                } else {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.ADD_TO_CART_FAILED),
                        content: this.props.languageContext.current.getMessageString(MessageId.ADD_TO_CART_FAILED_CONTENT),
                    });
                }
            })
            .catch((error) => {
                this.props.appDialogContext.addDialog({
                    title: this.props.languageContext.current.getMessageString(MessageId.ADD_TO_CART_FAILED),
                    content: this.props.languageContext.current.getMessageString(MessageId.ADD_TO_CART_FAILED_CONTENT),
                });
            });
    }

    onExportWarehouse() {
        if (FrameworkUtils.validateFrom(this.exportWarehouseFormRef)) {
            if (Number(this.exportWarehouseFormRef.amount.current.getValue()) <= this.state.warehouse.amount) {
                this.warehouseApiService.update(this.state.warehouse._id, {
                    amount: (this.state.warehouse.amount - Number(this.exportWarehouseFormRef.amount.current.getValue()))
                } as IWarehouseModel)
                    .then(response => {
                        if (response.status === HttpRequestStatusCode.OK) {
                            this.props.appDialogContext.addDialog({
                                title: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS),
                                content: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS_DETAIL)
                            })

                            this.requestApi(this.state.warehouse._id);
                            FrameworkUtils.formClear(this.exportWarehouseFormRef);
                        } else {
                            this.props.appDialogContext.addDialog({
                                title: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE),
                                content: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE_DETAIL)
                            })    
                        }
                    })
                    .catch(error => {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE_DETAIL)
                        })
                    })
            } else {
                this.props.appDialogContext.addDialog({
                    title: this.props.languageContext.current.getMessageString(MessageId.NOT_ENOUGH),
                    content: this.props.languageContext.current.getMessageString(MessageId.NOT_ENOUGH_CONTENT)
                })

                this.exportWarehouseFormRef.amount.current.setErrorMessage(
                    this.props.languageContext.current.getMessageString(MessageId.NOT_ENOUGH)
                )
            }
        }
    }

    onImportWarehouse() {
        if (FrameworkUtils.validateFrom(this.importWarehouseFormRef)) {
            this.warehouseApiService.update(this.state.warehouse._id, {
                amount: (this.state.warehouse.amount + Number(this.importWarehouseFormRef.amount.current.getValue()))
            } as IWarehouseModel).then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS),
                        content: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS_DETAIL)
                    })

                    this.requestApi(this.state.warehouse._id);
                    FrameworkUtils.formClear(this.importWarehouseFormRef);
                } else {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE),
                        content: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE_DETAIL)
                    }) 
                }
            })
            .catch(error => {
                this.props.appDialogContext.addDialog({
                    title: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE),
                    content: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE_DETAIL)
                })
            })
        }
    }

    render() {
        return (
            <FrameworkComponents.BasePage
                {...{
                    title: this.props.languageContext.current.getMessageString(MessageId.WAREHOUSE_ITEM_DETAIL),
                }}
            >
                <FrameworkComponents.Table header={this.renderTableHeader()} content={this.renderTableContent()} />

                <FrameworkComponents.BaseForm title={this.props.languageContext.current.getMessageString(MessageId.EXPORT_WAREHOUSE)}>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.AMOUNT)}
                            ref={this.exportWarehouseFormRef.amount}
                            validate={[new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_NUMBER, AppConstant.ONLY_NUMBER_REGEXP)]}
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.Button
                            dialogModel={{
                                title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE),
                                content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE_DETAIL)
                            }}
                            onClick={this.onExportWarehouse}
                            type={ButtonTypeConstant.PRIMARY}>{this.props.languageContext.current.getMessageString(MessageId.EXPORT_WAREHOUSE)}</FrameworkComponents.Button>
                    </FrameworkComponents.FormGroup>
                </FrameworkComponents.BaseForm>

                <FrameworkComponents.BaseForm title={this.props.languageContext.current.getMessageString(MessageId.IMPORT_WAREHOUSE)}>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.AMOUNT)}
                            validate={[new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_NUMBER, AppConstant.ONLY_NUMBER_REGEXP)]}
                            ref={this.importWarehouseFormRef.amount}
                         />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.Button
                            dialogModel={{
                                title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE),
                                content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE_DETAIL)
                            }}
                            onClick={this.onImportWarehouse}
                            type={ButtonTypeConstant.PRIMARY}>{this.props.languageContext.current.getMessageString(MessageId.IMPORT_WAREHOUSE)}</FrameworkComponents.Button>
                    </FrameworkComponents.FormGroup>
                </FrameworkComponents.BaseForm>

                <FrameworkComponents.BaseForm title={this.props.languageContext.current.getMessageString(MessageId.ADD_TO_CART)}>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.InputText
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.AMOUNT)}
                            ref={this.warehouseItemFormRef.amount}
                            validate={[
                                new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE),
                                new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_NUMBER, new RegExp(AppConstant.ONLY_NUMBER_REGEXP)),
                            ]}
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.SelectBox
                            ref={this.warehouseItemFormRef.discountType}
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.DISCOUNT_TYPE)}
                            options={AppRenderUtils.renderDiscountType(this.props.languageContext)}
                        />
                        <FrameworkComponents.InputText
                            ref={this.warehouseItemFormRef.percent}
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.PERCENT)}
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.InputText
                            readOnly={true}
                            ref={this.warehouseItemFormRef.unitPrice}
                            value={this.state.unitPrice}
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.UNIT_PRICE)}
                        />
                        <FrameworkComponents.InputText
                            readOnly={true}
                            ref={this.warehouseItemFormRef.totalAmount}
                            value={this.state.totalAmount}
                            placeHolder={this.props.languageContext.current.getMessageString(MessageId.TOTAL_AMOUNT)}
                        />
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.Button type={ButtonTypeConstant.FLAT}>
                            {this.props.languageContext.current.getMessageString(MessageId.CANCEL)}
                        </FrameworkComponents.Button>
                        <FrameworkComponents.Button type={ButtonTypeConstant.PRIMARY} onClick={this.onCalculator}>
                            {this.props.languageContext.current.getMessageString(MessageId.CALCULATED)}
                        </FrameworkComponents.Button>
                    </FrameworkComponents.FormGroup>
                    <FrameworkComponents.FormGroup>
                        <FrameworkComponents.Button type={ButtonTypeConstant.PRIMARY} disable={!this.state.unitPrice || !this.state.totalAmount} onClick={this.addToCart}>
                            {this.props.languageContext.current.getMessageString(MessageId.ADD_TO_CART)}
                        </FrameworkComponents.Button>
                    </FrameworkComponents.FormGroup>
                </FrameworkComponents.BaseForm>
            </FrameworkComponents.BasePage>
        );
    }
}

export default WithFramework.withLanguage(WithFramework.withAppDialog(WithFramework.withAppUrl(WithFramework.withUserLogin(WithCart(WarehouseItem)))));
