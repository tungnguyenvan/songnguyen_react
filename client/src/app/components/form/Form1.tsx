import ISizeModel from "app/documents/ISizeModel";
import IStandardModel from "app/documents/IStandardModel";
import FrameworkComponents from "framework/components/FrameworkComponents"
import IFormInputElement from "framework/components/IFormInputElement";
import AppConstant from "framework/constants/AppConstant";
import { FormType } from "framework/constants/AppEnumConstant";
import MessageId from "framework/constants/MessageId"
import RuleConstant from "framework/constants/RuleConstant";
import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import Rule from "framework/documents/models/Rule";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import React from "react"

interface Form1Props {
    languageContext: ILanguageContext
    isCalculatorModel: boolean
    size?: ISizeModel
    standard?: IStandardModel
    title?: string,
    small?: boolean
}

interface IForm1ref {
    inputInnerDiameter: React.RefObject<any>;
    inputOuterDiameter: React.RefObject<any>;
    inputHoleCount: React.RefObject<any>;
    inputHoleDiameter: React.RefObject<any>;
    inputCoefficient: React.RefObject<any>;
    inputBolt: React.RefObject<any>;
    inputWorkPrice: React.RefObject<any>;
    inputMaterialPrice: React.RefObject<any>;
}

interface IFromValidate {
    inputInnerDiameter: Rule[];
    inputOuterDiameter: Rule[];
    inputHoleCount: Rule[];
    inputHoleDiameter: Rule[];
    inputCoefficient: Rule[];
    inputBolt: Rule[];
    inputWorkPrice: Rule[];
    inputMaterialPrice: Rule[];
}

const defaultRule: Rule[] = [
    new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE),
    new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_FLOAT, AppConstant.DOUBLE_NUMBER_REGEXP)
]

class Form1 extends React.Component<Form1Props> implements IFormInputElement {
    private formRef: IForm1ref;
    private formValidate: IFromValidate

    constructor(props: Form1Props) {
        super(props)

        this.formRef = {
            inputInnerDiameter: React.createRef<IFormInputElement>(),
            inputOuterDiameter: React.createRef<IFormInputElement>(),
            inputHoleCount: React.createRef<IFormInputElement>(),
            inputHoleDiameter: React.createRef<IFormInputElement>(),
            inputCoefficient: React.createRef<IFormInputElement>(),
            inputBolt: React.createRef<IFormInputElement>(),
            inputWorkPrice: React.createRef<IFormInputElement>(),
            inputMaterialPrice: React.createRef<IFormInputElement>(),
        }
        this.formValidate = {
            inputInnerDiameter: [...defaultRule],
            inputOuterDiameter: [...defaultRule],
            inputHoleCount: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_NUMBER, AppConstant.ONLY_NUMBER_REGEXP)],
            inputHoleDiameter: [...defaultRule],
            inputCoefficient: [...defaultRule],
            inputBolt: [...defaultRule],
            inputWorkPrice: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_NUMBER, AppConstant.ONLY_NUMBER_REGEXP)],
            inputMaterialPrice: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_NUMBER, AppConstant.ONLY_NUMBER_REGEXP)],
        }

        this.getValue = this.getValue.bind(this);
        this.setMaterialPrice = this.setMaterialPrice.bind(this);
    }

    isValid(): boolean {
        return FrameworkUtils.validateFrom(this.formRef)
    }

    setErrorMessage(errorMessage: string): void {
        FrameworkUtils.setErrorMessage(this.formRef, errorMessage)
    }

    setMaterialPrice(price: number) {
        this.formRef.inputMaterialPrice.current.setValue(price)
        this.formRef.inputWorkPrice.current.setValue((price * 1.1).toFixed(0))
    }

    getValue() {
        const valueModel: ISizeModel = {
            inner_diameter: parseFloat(this.formRef.inputInnerDiameter.current.getValue()),
            outer_diameter: parseFloat(this.formRef.inputOuterDiameter.current.getValue()),
            hole_count: parseFloat(this.formRef.inputHoleCount.current.getValue()) | 0,
            hole_diameter: parseFloat(this.formRef.inputHoleDiameter.current.getValue()) | 0,
            material_price: parseFloat(this.formRef.inputMaterialPrice.current.getValue()),
            work_price: parseFloat(this.formRef.inputWorkPrice.current.getValue()),
            form_type: FormType.FORM_1,
        } as ISizeModel

        return valueModel
    }

    isChanged(): boolean {
        return FrameworkUtils.formHasChanged(this.formRef)
    }

    clear(): void {
        FrameworkUtils.formClear(this.formRef)
    }

    render() {
        return <FrameworkComponents.BaseForm
            title={this.props.title}
            small={this.props.small}>
            <FrameworkComponents.FormGroup>
                <FrameworkComponents.InputText
                    ref={this.formRef.inputInnerDiameter}
                    placeHolder={this.props.languageContext.current.getMessageString(MessageId.INNER_DIAMETER)}
                    validate={this.formValidate.inputInnerDiameter}
                    value={this.props.size?.inner_diameter} />
                <FrameworkComponents.InputText
                    ref={this.formRef.inputOuterDiameter}
                    placeHolder={this.props.languageContext.current.getMessageString(MessageId.OUTER_DIAMETER)}
                    validate={this.formValidate.inputOuterDiameter}
                    value={this.props.size?.outer_diameter} />
            </FrameworkComponents.FormGroup>
            <FrameworkComponents.FormGroup>
                <FrameworkComponents.InputText
                    ref={this.formRef.inputHoleCount}
                    placeHolder={this.props.languageContext.current.getMessageString(MessageId.HOLE_COUNT)}
                    validate={this.formValidate.inputHoleCount}
                    value={this.props.size?.hole_count} />
                <FrameworkComponents.InputText
                    ref={this.formRef.inputHoleDiameter}
                    placeHolder={this.props.languageContext.current.getMessageString(MessageId.HOLE_DIAMETER)}
                    validate={this.formValidate.inputHoleDiameter}
                    value={this.props.size?.hole_diameter} />
            </FrameworkComponents.FormGroup>
            {this.props.isCalculatorModel && 
            <FrameworkComponents.FormGroup>
                <FrameworkComponents.InputText
                    ref={this.formRef.inputCoefficient}
                    readOnly={true}
                    value={this.props.standard?.coefficient}
                    placeHolder={this.props.languageContext.current.getMessageString(MessageId.COEFFICIENT)}
                    validate={this.formValidate.inputCoefficient} />
                <FrameworkComponents.InputText
                    ref={this.formRef.inputBolt}
                    readOnly={true}
                    value={this.props.standard?.bolt}
                    placeHolder={this.props.languageContext.current.getMessageString(MessageId.BOLT)}
                    validate={this.formValidate.inputBolt} />
            </FrameworkComponents.FormGroup>}
            <FrameworkComponents.FormGroup>
                <FrameworkComponents.InputText
                    ref={this.formRef.inputMaterialPrice}
                    placeHolder={this.props.languageContext.current.getMessageString(MessageId.MATERIAL_PRICE)}
                    validate={this.formValidate.inputMaterialPrice} />
                <FrameworkComponents.InputText
                    ref={this.formRef.inputWorkPrice}
                    placeHolder={this.props.languageContext.current.getMessageString(MessageId.WORK_PRICE)}
                    validate={this.formValidate.inputWorkPrice} />
            </FrameworkComponents.FormGroup>
        </FrameworkComponents.BaseForm>
    }
}

export default Form1