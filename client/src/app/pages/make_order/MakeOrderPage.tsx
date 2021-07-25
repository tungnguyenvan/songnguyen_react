import ProductNameApiService from "app/api/ProductNameApiService"
import ProductTypeApiService from "app/api/ProductTypeApiService"
import SizeApiService from "app/api/SizeApiService"
import StandardApiService from "app/api/StandardApiService"
import SystemStandardApiService from "app/api/SystemStandardApiService"
import ThicknessApiService from "app/api/ThicknessApiService"
import Form1 from "app/components/form/Form1"
import IProductNameModel from "app/documents/IProductNameModel"
import IProductTypeModel from "app/documents/IProductTypeModel"
import ISizeModel from "app/documents/ISizeModel"
import IStandardModel from "app/documents/IStandardModel"
import ISystemStandardModel from "app/documents/ISystemStandardModel"
import IThicknessModel from "app/documents/IThicknessModel"
import AppRenderUtils from "app/utils/AppRenderUtils"
import FrameworkComponents from "framework/components/FrameworkComponents"
import IFromInputElement from "framework/components/IFormInputElement"
import AppConstant from "framework/constants/AppConstant"
import { DiscountType, FormType } from "framework/constants/AppEnumConstant"
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant"
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode"
import MessageId from "framework/constants/MessageId"
import RuleConstant from "framework/constants/RuleConstant"
import WithFramework from "framework/constants/WithFramework"
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext"
import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import IAppUrlContext from "framework/contexts/url/IAppUrlContext"
import Rule from "framework/documents/models/Rule"
import FrameworkUtils from "framework/utils/FrameworkUtils"
import React from "react"

const OUTER_EXTRAS = 1.1
const MIN_INNER_DIAMETER = 115

interface MakeOrderPageProps {
    languageContext: ILanguageContext
    appDialogContext: IAppDialogContext
    appUrlContext: IAppUrlContext
}

interface MakeOrderPageState {
    productTypes: IProductTypeModel[]
    productNames: IProductNameModel[]
    thicknesses: IThicknessModel[]
    thicknessSelected: IThicknessModel
    systemStandards: ISystemStandardModel[]
    standards: IStandardModel[]
    standardSelected: IStandardModel
    sizes: ISizeModel[]
    sizeSelected: ISizeModel
    formType: FormType
    unitPrice: number
    totalAmount: number
}

interface IMakeOrderFormRef {
    productType: React.RefObject<any>
    productName: React.RefObject<any>
    thickness: React.RefObject<any>
    priceSquareMeter: React.RefObject<any>
    systemStandard: React.RefObject<any>
    standard: React.RefObject<any>
    size: React.RefObject<any>
    form: React.RefObject<any>
    amount: React.RefObject<any>
    discountType: React.RefObject<any>
    percent: React.RefObject<any>
    unitPrice: React.RefObject<any>
    totalAmount: React.RefObject<any>
}

class MakeOrderPage extends React.Component<MakeOrderPageProps, MakeOrderPageState> {
    private thicknessApiService: ThicknessApiService
    private productTypeApiService: ProductTypeApiService
    private productNameApiService: ProductNameApiService
    private systemStandardApiService: SystemStandardApiService
    private standardApiService: StandardApiService
    private sizeApiService: SizeApiService
    private makeOrderForm: IMakeOrderFormRef

    constructor(props: MakeOrderPageProps) {
        super(props)

        this.sizeApiService = new SizeApiService()
        this.standardApiService = new StandardApiService()
        this.thicknessApiService = new ThicknessApiService()
        this.productTypeApiService = new ProductTypeApiService()
        this.productNameApiService = new ProductNameApiService()
        this.systemStandardApiService = new SystemStandardApiService()

        this.makeOrderForm = {
            productType: React.createRef<IFromInputElement>(),
            productName: React.createRef<IFromInputElement>(),
            thickness: React.createRef<IFromInputElement>(),
            priceSquareMeter: React.createRef<IFromInputElement>(),
            systemStandard: React.createRef<IFromInputElement>(),
            standard: React.createRef<IFromInputElement>(),
            size: React.createRef<IFromInputElement>(),
            form: React.createRef<IFromInputElement>(),
            amount: React.createRef<IFromInputElement>(),
            discountType: React.createRef<IFromInputElement>(),
            percent: React.createRef<IFromInputElement>(),
            unitPrice: React.createRef<IFromInputElement>(),
            totalAmount: React.createRef<IFromInputElement>()
        }

        this.state = {
            productTypes: [],
            productNames: [],
            thicknesses: [],
            thicknessSelected: {} as IThicknessModel,
            systemStandards: [],
            standards: [],
            standardSelected: {} as IStandardModel,
            sizes: [],
            sizeSelected: {} as ISizeModel,
            formType: undefined as unknown as FormType,
            unitPrice: 0,
            totalAmount: 0
        }

        this.onCancel = this.onCancel.bind(this)
        this.onCalculator = this.onCalculator.bind(this)
        this.sizeOnChanged = this.sizeOnChanged.bind(this)
        this.validateInForm = this.validateInForm.bind(this)
        this.calculatorForm1 = this.calculatorForm1.bind(this)
        this.standardOnChanged = this.standardOnChanged.bind(this)
        this.thicknessOnChanged = this.thicknessOnChanged.bind(this)
        this.productTypeOnChanged = this.productTypeOnChanged.bind(this)
        this.productNameOnChanged = this.productNameOnChanged.bind(this)
        this.systemStandardOnChanged = this.systemStandardOnChanged.bind(this)
    }

    componentDidMount() {
        // get product type
        this.productTypeApiService.all()
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        productTypes: response.data.data as IProductTypeModel[]
                    })
                }
            })
            
        // get system standard
        this.systemStandardApiService.all()
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        systemStandards: response.data.data as ISystemStandardModel[]
                    })
                }
            })
        
        this.sizeApiService.all()
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        sizes: response.data.data as ISizeModel[]
                    })
                }
            })
    }

    productTypeOnChanged(productTypeId: string): void {

        this.state.productTypes.forEach(element => {
            if (element._id === productTypeId) {
                this.setState({
                    formType: element.form_type
                })
            }
        })

        // get data of product name
        this.productNameApiService.all({
            product_type: {
                $in: [productTypeId]
            }
        }).then(response => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.setState({
                    productNames: response.data.data as IProductNameModel[]
                })
            }
        })
    }

    productNameOnChanged(productNameId: string): void {
        // get data of thickness
        this.thicknessApiService.all({
            product_name: {
                $in: [productNameId]
            }
        })
        .then(response => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.setState({
                    thicknesses: response.data.data as IThicknessModel[]
                })
            }
        })
    }

    thicknessOnChanged(thicknessId: string): void {
        this.state.thicknesses.forEach(element => {
            if (element._id === thicknessId) {
                this.setState({
                    thicknessSelected: element
                })
            }
        })
    }

    systemStandardOnChanged(systemStandardId: string): void {
        this.standardApiService.all({
            system_standard: {
                $in: [systemStandardId]
            }
        })
        .then(response => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.setState({
                    standards: response.data.data as IStandardModel[]
                })
            }
        })
    }

    sizeOnChanged(id: string): void {
        this.state.sizes.forEach(element => {
            if (element._id === id) {
                this.setState({
                    sizeSelected: element
                })
            }
        })
    }

    standardOnChanged(id: string): void {
        this.state.standards.forEach(element => {
            if (element._id === id) {
                this.setState({
                    standardSelected: element
                })
            }
        })
    }

    onCalculator() {
        if (FrameworkUtils.validateFrom(this.makeOrderForm) && this.validateInForm()) {
            const sizeModel = this.makeOrderForm.form.current.getValue()

            if (sizeModel) {
                switch (this.state.formType) {
                    case FormType.FORM_1: {
                        this.calculatorForm1(sizeModel)
                    }
                }
            }
        }
    }

    validateInForm() {
        const discountType = this.makeOrderForm.discountType.current.getValue() as DiscountType
        console.log(discountType, this.makeOrderForm.percent.current.getValue())
        if (discountType === DiscountType.DISCOUNT || discountType === DiscountType.INCREASE) {
            if (FrameworkUtils.isBlank(this.makeOrderForm.percent.current.getValue())) {
                this.makeOrderForm.percent.current.setErrorMessage(this.props.languageContext.current.getMessageString(MessageId.VALIDATE_NEED_INPUT_PERCENT))
                return false
            }

            if (!(new RegExp(AppConstant.DOUBLE_NUMBER_REGEXP).test(this.makeOrderForm.percent.current.getValue()))) {
                this.makeOrderForm.percent.current.setErrorMessage(this.props.languageContext.current.getMessageString(MessageId.VALIDATE_ONLY_FLOAT))
                return false
            }
        }

        return true
    }

    onCancel() {
        FrameworkUtils.formClear(this.makeOrderForm)
    }

    calculatorForm1(sizeModel: ISizeModel) {

        const discountPercent = this.makeOrderForm.percent.current.getValue() as number
        const discountType = this.makeOrderForm.discountType.current.getValue() as DiscountType

        let dt = (sizeModel.outer_diameter * OUTER_EXTRAS) / 1000
        const dtp = dt * dt

        let coreDiscount = 0
        if (sizeModel.inner_diameter > MIN_INNER_DIAMETER) {
            coreDiscount = Math.PI * (Math.pow(sizeModel.inner_diameter / 1000, 2) / 4)
        }

        dt = Math.round((dtp - coreDiscount) * 100) / 100
        let dtPrice = (this.makeOrderForm.priceSquareMeter.current.getValue() as number) * dt
        let tempValue = dtPrice + sizeModel.work_price + sizeModel.material_price
        tempValue = Math.round(tempValue / 1000) * 1000
        let totalAmount = tempValue * (this.makeOrderForm.amount.current.getValue() as number)
        this.setState({
            unitPrice: tempValue
        })

        // calculator discount
        if (discountType === DiscountType.DISCOUNT) {
            totalAmount = totalAmount - (totalAmount * discountPercent)
        } else if (discountType === DiscountType.INCREASE) {
            totalAmount = totalAmount + (totalAmount * discountPercent/100)
        }
        this.setState({
            totalAmount: totalAmount
        })
    }

    render() {
        return <FrameworkComponents.BasePage {...{
            title: this.props.languageContext.current.getMessageString(MessageId.MAKE_ORDER)
        }}>
            <FrameworkComponents.BaseForm
                title={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_OPTION)}>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_TYPE)}
                        options={AppRenderUtils.renderProductTypeSelectBox(this.state.productTypes)}
                        onChanged={this.productTypeOnChanged}
                        required={true}
                        disable={!this.state.productTypes.length}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                        ref={this.makeOrderForm.productType} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_NAME)}
                        options={AppRenderUtils.renderProductNameSelectBox(this.state.productNames)}
                        onChanged={this.productNameOnChanged}
                        disable={!this.state.productNames.length}
                        required={true}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                        ref={this.makeOrderForm.productName} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.THICKNESS)}
                        options={AppRenderUtils.renderThicknessSelectBox(this.state.thicknesses)}
                        onChanged={this.thicknessOnChanged}
                        disable={!this.state.thicknesses.length}
                        required={true}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                        ref={this.makeOrderForm.thickness} />
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.M2_PRICE)}
                        value={this.state.thicknessSelected.price}
                        readOnly={!this.state.thicknessSelected.price}
                        ref={this.makeOrderForm.priceSquareMeter} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.SYSTEM_STANDARD)}
                        options={AppRenderUtils.renderSystemStandard(this.state.systemStandards)}
                        onChanged={this.systemStandardOnChanged}
                        required={true}
                        disable={!this.state.systemStandards.length || this.state.formType !== FormType.FORM_1}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                        ref={this.makeOrderForm.systemStandard} />
                    <FrameworkComponents.SelectBox
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.STANDARD)}
                        options={AppRenderUtils.renderStandard(this.state.standards)}
                        required={true}
                        disable={!this.state.standards.length || this.state.formType !== FormType.FORM_1}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                        onChanged={this.standardOnChanged}
                        ref={this.makeOrderForm.standard} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.SIZE)}
                        options={AppRenderUtils.renderSizeSelectBox(this.state.sizes)}
                        required={true}
                        disable={!this.state.sizes.length || this.state.formType !== FormType.FORM_1}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                        onChanged={this.sizeOnChanged}
                        ref={this.makeOrderForm.size} />
                </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>

            {(this.state.formType === FormType.FORM_1 && this.state.sizeSelected._id && this.state.standardSelected._id) &&
            <Form1
                title={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_INFORMATION)}
                languageContext={this.props.languageContext}
                isCalculatorModel={true}
                size={this.state.sizeSelected}
                standard={this.state.standardSelected}
                ref={this.makeOrderForm.form} />}
            
            <FrameworkComponents.BaseForm title={this.props.languageContext.current.getMessageString(MessageId.ORDER_INFORMATION)}>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.AMOUNT)}
                        ref={this.makeOrderForm.amount}
                        validate={[new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_NUMBER, new RegExp(AppConstant.ONLY_NUMBER_REGEXP))]} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.DISCOUNT_TYPE)}
                        options={AppRenderUtils.renderDiscountType(this.props.languageContext)}
                        ref={this.makeOrderForm.discountType} />
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.PERCENT)}
                        ref={this.makeOrderForm.percent} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        readOnly={true}
                        value={this.state.unitPrice > 0 ? this.state.unitPrice : ""}
                        ref={this.makeOrderForm.unitPrice}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.UNIT_PRICE)} />
                    <FrameworkComponents.InputText
                        readOnly={true}
                        value={this.state.totalAmount ? this.state.totalAmount : ""}
                        ref={this.makeOrderForm.totalAmount}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.TOTAL_AMOUNT)} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.FLAT}
                        onClick={this.onCancel}>
                        {this.props.languageContext.current.getMessageString(MessageId.CANCEL)}
                    </FrameworkComponents.Button>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.PRIMARY}
                        onClick={this.onCalculator}>
                        {this.props.languageContext.current.getMessageString(MessageId.CALCULATED)}
                    </FrameworkComponents.Button>
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button
                        disable={!this.state.unitPrice || !this.state.totalAmount}
                        type={ButtonTypeConstant.PRIMARY}>
                        {this.props.languageContext.current.getMessageString(MessageId.ADD_TO_CART)}
                    </FrameworkComponents.Button>
                </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>
        </FrameworkComponents.BasePage>
    }
}

export default WithFramework.withLanguage(
    WithFramework.withAppDialog(
        WithFramework.withAppUrl(MakeOrderPage)
    )
)