import ISizeModel from "app/documents/ISizeModel"
import IStandardModel from "app/documents/IStandardModel"
import AppRenderUtils from "app/utils/AppRenderUtils"
import FrameworkComponents from "framework/components/FrameworkComponents"
import { FormType, GasketPTCShape } from "framework/constants/AppEnumConstant"
import MessageId from "framework/constants/MessageId"
import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import React from "react"
import RFCircleResource from "app/resources/image/1.png"
import FFCircleResource from "app/resources/image/2.png"
import RFRectangleResource from "app/resources/image/3.png"
import FFRectangleResource from "app/resources/image/4.png"
import FFManholeResource from "app/resources/image/5.png"
import IFormInputElement from "framework/components/IFormInputElement"
import FrameworkUtils from "framework/utils/FrameworkUtils"
import Rule from "framework/documents/models/Rule"
import RuleConstant from "framework/constants/RuleConstant"
import AppConstant from "framework/constants/AppConstant"

interface IShapeResource {
    shapeType: GasketPTCShape
    resource: string
}

interface Form2Props {
    languageContext: ILanguageContext
    isCalculatorModel: boolean
    size?: ISizeModel
    standard?: IStandardModel
    title?: string,
    small?: boolean
}

interface Form2State {
    shapeChoosed: IShapeResource
}

interface IForm2FormRef {
    shapeType: React.RefObject<any>
    innerDiameter: React.RefObject<any>
    outerDiameter: React.RefObject<any>
    wnDiameter: React.RefObject<any>
    wtDiameter: React.RefObject<any>
    lnDiameter: React.RefObject<any>
    ltDiameter: React.RefObject<any>
    irDiameter: React.RefObject<any>
    orDiameter: React.RefObject<any>
    holeCount: React.RefObject<any>
    holeDiameter: React.RefObject<any>
    bl: React.RefObject<any>
    bolt: React.RefObject<any>
    coefficient: React.RefObject<any>
    materialPrice: React.RefObject<any>
    workPrice: React.RefObject<any>
}

interface IFrom2FromValidate {
    shapeType: Rule[]
    innerDiameter: Rule[]
    outerDiameter: Rule[]
    wnDiameter: Rule[]
    wtDiameter: Rule[]
    lnDiameter: Rule[]
    ltDiameter: Rule[]
    irDiameter: Rule[]
    orDiameter: Rule[]
    holeCount: Rule[]
    holeDiameter: Rule[]
    bl: Rule[]
    materialPrice: Rule[]
    workPrice: Rule[]
}

const shapeResources: IShapeResource[] = [
    {
        shapeType: GasketPTCShape.RF_CIRCLE,
        resource: RFCircleResource
    },
    {
        shapeType: GasketPTCShape.FF_CIRCLE,
        resource: FFCircleResource
    },
    {
        shapeType: GasketPTCShape.RF_RECTANGLE,
        resource: RFRectangleResource
    },
    {
        shapeType: GasketPTCShape.FF_RECTANGLE,
        resource: FFRectangleResource
    },
    {
        shapeType: GasketPTCShape.FF_MANHOLE,
        resource: FFManholeResource
    }
]

class Form2 extends React.Component<Form2Props, Form2State> implements IFormInputElement {
    private formRef: IForm2FormRef
    private formValidate: IFrom2FromValidate

    constructor(props: Form2Props) {
        super(props)

        this.formRef = {
            shapeType: React.createRef<IFormInputElement>(),
            innerDiameter: React.createRef<IFormInputElement>(),
            outerDiameter: React.createRef<IFormInputElement>(),
            wnDiameter: React.createRef<IFormInputElement>(),
            wtDiameter: React.createRef<IFormInputElement>(),
            lnDiameter: React.createRef<IFormInputElement>(),
            ltDiameter: React.createRef<IFormInputElement>(),
            irDiameter: React.createRef<IFormInputElement>(),
            orDiameter: React.createRef<IFormInputElement>(),
            holeCount: React.createRef<IFormInputElement>(),
            holeDiameter: React.createRef<IFormInputElement>(),
            bl: React.createRef<IFormInputElement>(),
            bolt: React.createRef<IFormInputElement>(),
            coefficient: React.createRef<IFormInputElement>(),
            materialPrice: React.createRef<IFormInputElement>(),
            workPrice: React.createRef<IFormInputElement>()
        }

        this.formValidate = {
            shapeType: [],
            innerDiameter: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_FLOAT, new RegExp(AppConstant.DOUBLE_NUMBER_REGEXP))],
            outerDiameter: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_FLOAT, new RegExp(AppConstant.DOUBLE_NUMBER_REGEXP))],
            wnDiameter: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_FLOAT, new RegExp(AppConstant.DOUBLE_NUMBER_REGEXP))],
            wtDiameter: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_FLOAT, new RegExp(AppConstant.DOUBLE_NUMBER_REGEXP))],
            lnDiameter: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_FLOAT, new RegExp(AppConstant.DOUBLE_NUMBER_REGEXP))],
            ltDiameter: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_FLOAT, new RegExp(AppConstant.DOUBLE_NUMBER_REGEXP))],
            irDiameter: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_FLOAT, new RegExp(AppConstant.DOUBLE_NUMBER_REGEXP))],
            orDiameter: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_FLOAT, new RegExp(AppConstant.DOUBLE_NUMBER_REGEXP))],
            holeCount: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_NUMBER, new RegExp(AppConstant.ONLY_NUMBER_REGEXP))],
            holeDiameter: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_FLOAT, new RegExp(AppConstant.DOUBLE_NUMBER_REGEXP))],
            bl: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_FLOAT, new RegExp(AppConstant.DOUBLE_NUMBER_REGEXP))],
            materialPrice: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_NUMBER, new RegExp(AppConstant.ONLY_NUMBER_REGEXP))],
            workPrice: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_NUMBER, new RegExp(AppConstant.ONLY_NUMBER_REGEXP))]
        }

        this.state = {
            shapeChoosed: {} as IShapeResource
        }

        this.clear = this.clear.bind(this)
        this.isValid = this.isValid.bind(this)
        this.getValue = this.getValue.bind(this)
        this.isChanged = this.isChanged.bind(this)
        this.innerOnChange = this.innerOnChange.bind(this)
        this.setErrorMessage = this.setErrorMessage.bind(this)
        this.setMaterialPrice = this.setMaterialPrice.bind(this)
        this.chooseShapeOnChanged = this.chooseShapeOnChanged.bind(this)
        this.holeDiameterOnChange = this.holeDiameterOnChange.bind(this)
    }

    isValid(): boolean {
        return FrameworkUtils.validateFrom(this.formRef)
    }

    setErrorMessage(errorMessage: string): void {
        FrameworkUtils.setErrorMessage(this.formRef, errorMessage)
    }

    getValue() {
        let size: ISizeModel = undefined as unknown as ISizeModel

        switch(this.state.shapeChoosed.shapeType) {
            case GasketPTCShape.RF_CIRCLE: {
                size = {
                    shape_type: this.state.shapeChoosed.shapeType,
                    inner_diameter: parseFloat(this.formRef.innerDiameter.current.getValue()),
                    outer_diameter: parseFloat(this.formRef.outerDiameter.current.getValue()),
                    bl: parseFloat(this.formRef.bl.current.getValue()),
                    material_price: parseFloat(this.formRef.materialPrice.current.getValue()),
                    work_price: parseFloat(this.formRef.workPrice.current.getValue()),
                    form_type: FormType.FORM_2
                } as ISizeModel
                break;
            }
            case GasketPTCShape.FF_CIRCLE: {
                size = {
                    shape_type: this.state.shapeChoosed.shapeType,
                    inner_diameter: parseFloat(this.formRef.innerDiameter.current.getValue()),
                    outer_diameter: parseFloat(this.formRef.outerDiameter.current.getValue()),
                    hole_count: parseFloat(this.formRef.holeCount.current.getValue()),
                    hole_diameter: parseFloat(this.formRef.holeDiameter.current.getValue()),
                    bl: parseFloat(this.formRef.bl.current.getValue()),
                    material_price: parseFloat(this.formRef.materialPrice.current.getValue()),
                    work_price: parseFloat(this.formRef.workPrice.current.getValue()),
                    form_type: FormType.FORM_2
                } as ISizeModel
                break;
            }
            case GasketPTCShape.RF_RECTANGLE: {
                size = {
                    shape_type: this.state.shapeChoosed.shapeType,
                    wn: parseFloat(this.formRef.wnDiameter.current.getValue()),
                    wt: parseFloat(this.formRef.wtDiameter.current.getValue()),
                    ln: parseFloat(this.formRef.lnDiameter.current.getValue()),
                    lt: parseFloat(this.formRef.ltDiameter.current.getValue()),
                    bl: parseFloat(this.formRef.bl.current.getValue()),
                    material_price: parseFloat(this.formRef.materialPrice.current.getValue()),
                    work_price: parseFloat(this.formRef.workPrice.current.getValue()),
                    form_type: FormType.FORM_2
                } as ISizeModel
                break;
            }
            case GasketPTCShape.FF_RECTANGLE: {
                size = {
                    shape_type: this.state.shapeChoosed.shapeType,
                    wn: parseFloat(this.formRef.wnDiameter.current.getValue()),
                    wt: parseFloat(this.formRef.wtDiameter.current.getValue()),
                    ln: parseFloat(this.formRef.lnDiameter.current.getValue()),
                    lt: parseFloat(this.formRef.ltDiameter.current.getValue()),
                    hole_count: parseFloat(this.formRef.holeCount.current.getValue()),
                    hole_diameter: parseFloat(this.formRef.holeDiameter.current.getValue()),
                    bl: parseFloat(this.formRef.bl.current.getValue()),
                    material_price: parseFloat(this.formRef.materialPrice.current.getValue()),
                    work_price: parseFloat(this.formRef.workPrice.current.getValue()),
                    form_type: FormType.FORM_2
                } as ISizeModel
                break;
            }
            case GasketPTCShape.FF_MANHOLE: {
                size = {
                    shape_type: this.state.shapeChoosed.shapeType,
                    wn: parseFloat(this.formRef.wnDiameter.current.getValue()),
                    ln: parseFloat(this.formRef.lnDiameter.current.getValue()),
                    ir: parseFloat(this.formRef.irDiameter.current.getValue()),
                    or: parseFloat(this.formRef.orDiameter.current.getValue()),
                    hole_count: parseFloat(this.formRef.holeCount.current.getValue()),
                    hole_diameter: parseFloat(this.formRef.holeDiameter.current.getValue()),
                    bl: parseFloat(this.formRef.bl.current.getValue()),
                    material_price: parseFloat(this.formRef.materialPrice.current.getValue()),
                    work_price: parseFloat(this.formRef.workPrice.current.getValue()),
                    form_type: FormType.FORM_2
                } as ISizeModel
                break;
            }
        }

        return size
    }

    isChanged(): boolean {
        return true
    }

    clear(): void {
        FrameworkUtils.formClear(this.formRef)
    }

    innerOnChange() {
        switch(this.state.shapeChoosed.shapeType) {
            case GasketPTCShape.RF_CIRCLE:
            case GasketPTCShape.FF_CIRCLE: {
                this.formRef.bolt.current.setValue(FrameworkUtils.onCalculatorBoltC(parseFloat(this.formRef.innerDiameter.current.getValue()), this.state.shapeChoosed.shapeType))
            }
        }
    }

    holeDiameterOnChange() {
        switch(this.state.shapeChoosed.shapeType) {
            case GasketPTCShape.FF_CIRCLE:
            case GasketPTCShape.FF_RECTANGLE:
            case GasketPTCShape.FF_MANHOLE: {
                this.formRef.bl.current.setValue(FrameworkUtils.calculatorBL(parseFloat(this.formRef.holeDiameter.current.getValue())))
            }
        }
    }

    chooseShapeOnChanged(id: string) {
        const shapeType: GasketPTCShape = id as GasketPTCShape
        let shapeResource: IShapeResource = {} as IShapeResource
        shapeResources.forEach(element => {
            if (element.shapeType === shapeType) {
                shapeResource = element
            }
        })
        this.setState({
            shapeChoosed: shapeResource
        })
    }

    setMaterialPrice(price: number) {
        this.formRef.materialPrice.current.setValue(price)
        this.formRef.workPrice.current.setValue((price * 1.1).toFixed(0))
    }

    render() {
        return <div>
            <FrameworkComponents.BaseForm title={this.props.title} small={this.props.small}>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.CHOOSE_SHAPE)}
                        options={AppRenderUtils.renderChooseShape(this.props.languageContext)}
                        onChanged={this.chooseShapeOnChanged}
                        ref={this.formRef.shapeType}
                        required={true}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    {this.state.shapeChoosed.resource && <img src={this.state.shapeChoosed.resource} alt='Shape' style={{
                        width: 128,
                    }} />}
                </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.INNER_DIAMETER)}
                        ref={this.formRef.innerDiameter}
                        onChange={this.innerOnChange}
                        readOnly={this.state.shapeChoosed.shapeType === GasketPTCShape.FF_RECTANGLE ||
                        this.state.shapeChoosed.shapeType === GasketPTCShape.RF_RECTANGLE ||
                        this.state.shapeChoosed.shapeType === GasketPTCShape.FF_MANHOLE ||
                        !this.state.shapeChoosed.shapeType}
                        validate={this.formValidate.innerDiameter} />
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.OUTER_DIAMETER)}
                        ref={this.formRef.outerDiameter}
                        readOnly={this.state.shapeChoosed.shapeType === GasketPTCShape.FF_RECTANGLE ||
                        this.state.shapeChoosed.shapeType === GasketPTCShape.RF_RECTANGLE ||
                        this.state.shapeChoosed.shapeType === GasketPTCShape.FF_MANHOLE ||
                        !this.state.shapeChoosed.shapeType}
                        validate={this.formValidate.outerDiameter} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.WN_DIAMETER)}
                        ref={this.formRef.wnDiameter}
                        readOnly={this.state.shapeChoosed.shapeType === GasketPTCShape.RF_CIRCLE ||
                                this.state.shapeChoosed.shapeType === GasketPTCShape.FF_CIRCLE ||
                                !this.state.shapeChoosed.shapeType}
                        validate={this.formValidate.wnDiameter}/>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.WT_DIAMETER)}
                        ref={this.formRef.wtDiameter}
                        readOnly={this.state.shapeChoosed.shapeType === GasketPTCShape.RF_CIRCLE ||
                            this.state.shapeChoosed.shapeType === GasketPTCShape.FF_CIRCLE ||
                            this.state.shapeChoosed.shapeType === GasketPTCShape.FF_MANHOLE ||
                            !this.state.shapeChoosed.shapeType}
                        validate={this.formValidate.wtDiameter} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.LN_DIAMETER)}
                        ref={this.formRef.lnDiameter}
                        readOnly={this.state.shapeChoosed.shapeType === GasketPTCShape.RF_CIRCLE ||
                            this.state.shapeChoosed.shapeType === GasketPTCShape.FF_CIRCLE ||
                            !this.state.shapeChoosed.shapeType}
                        validate={this.formValidate.lnDiameter} />
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.LT_DIAMETER)}
                        ref={this.formRef.ltDiameter}
                        readOnly={this.state.shapeChoosed.shapeType === GasketPTCShape.RF_CIRCLE ||
                            this.state.shapeChoosed.shapeType === GasketPTCShape.FF_CIRCLE ||
                            this.state.shapeChoosed.shapeType === GasketPTCShape.FF_MANHOLE ||
                            !this.state.shapeChoosed.shapeType}
                        validate={this.formValidate.ltDiameter} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.IR_DIAMETER)}
                        ref={this.formRef.irDiameter}
                        validate={this.formValidate.irDiameter}
                        readOnly={this.state.shapeChoosed.shapeType === GasketPTCShape.RF_CIRCLE ||
                            this.state.shapeChoosed.shapeType === GasketPTCShape.FF_CIRCLE ||
                            this.state.shapeChoosed.shapeType === GasketPTCShape.FF_RECTANGLE ||
                            this.state.shapeChoosed.shapeType === GasketPTCShape.RF_RECTANGLE ||
                            !this.state.shapeChoosed.shapeType} />
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.OR_DIAMETER)}
                        ref={this.formRef.orDiameter}
                        validate={this.formValidate.orDiameter}
                        readOnly={this.state.shapeChoosed.shapeType === GasketPTCShape.RF_CIRCLE ||
                            this.state.shapeChoosed.shapeType === GasketPTCShape.FF_CIRCLE ||
                            this.state.shapeChoosed.shapeType === GasketPTCShape.FF_RECTANGLE ||
                            this.state.shapeChoosed.shapeType === GasketPTCShape.RF_RECTANGLE ||
                            !this.state.shapeChoosed.shapeType} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.HOLE_COUNT)}
                        ref={this.formRef.holeCount}
                        validate={this.formValidate.holeCount}
                        readOnly={this.state.shapeChoosed.shapeType === GasketPTCShape.RF_CIRCLE ||
                        this.state.shapeChoosed.shapeType === GasketPTCShape.RF_RECTANGLE ||
                        !this.state.shapeChoosed.shapeType} />
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.HOLE_DIAMETER)}
                        ref={this.formRef.holeDiameter}
                        validate={this.formValidate.holeDiameter}
                        onChange={this.holeDiameterOnChange}
                        readOnly={this.state.shapeChoosed.shapeType === GasketPTCShape.RF_CIRCLE ||
                        this.state.shapeChoosed.shapeType === GasketPTCShape.RF_RECTANGLE ||
                        !this.state.shapeChoosed.shapeType} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.BL)}
                        ref={this.formRef.bl}
                        readOnly={!this.state.shapeChoosed.shapeType} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.COEFFICIENT)} />
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.BOLT)}
                        ref={this.formRef.bolt} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.MATERIAL_PRICE)}
                        ref={this.formRef.materialPrice}
                        readOnly={!this.state.shapeChoosed.shapeType} />
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.WORK_PRICE)}
                        ref={this.formRef.workPrice}
                        readOnly={!this.state.shapeChoosed.shapeType} />
                </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>
        </div>
    }
}

export default Form2