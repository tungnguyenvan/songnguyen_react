import FrameworkComponents from "framework/components/FrameworkComponents"
import IFormInputElement from "framework/components/IFormInputElement"
import MessageId from "framework/constants/MessageId"
import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import FrameworkUtils from "framework/utils/FrameworkUtils"
import React from "react"
import Rule from "framework/documents/models/Rule"
import RuleConstant from "framework/constants/RuleConstant"
import AppConstant from "framework/constants/AppConstant"
import ISizeModel from "app/documents/ISizeModel"
import { FormType } from "framework/constants/AppEnumConstant"

interface Form3Props {
    languageContext: ILanguageContext
    title: string,
    small?: boolean
}

interface IForm3FormRef {
    width: React.RefObject<any>
    length: React.RefObject<any>
}

interface IForm3FormValidate {
    width: Rule[],
    length: Rule[]
}

class Form3 extends React.Component<Form3Props> implements IFormInputElement {
    private formRef: IForm3FormRef
    private formValidate: IForm3FormValidate
    
    constructor(props: Form3Props) {
        super(props)

        this.formRef = {
            width: React.createRef<IFormInputElement>(),
            length: React.createRef<IFormInputElement>()
        }
        this.formValidate = {
            width: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_FLOAT, new RegExp(AppConstant.DOUBLE_NUMBER_REGEXP))],
            length: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_FLOAT, new RegExp(AppConstant.DOUBLE_NUMBER_REGEXP))]
        }

        this.clear = this.clear.bind(this)
        this.isValid = this.isValid.bind(this)
        this.getValue = this.getValue.bind(this)
        this.isChanged = this.isChanged.bind(this)
        this.setErrorMessage = this.setErrorMessage.bind(this)
    }

    isValid(): boolean {
        return FrameworkUtils.validateFrom(this.formRef)
    }

    setErrorMessage(errorMessage: string): void {
        FrameworkUtils.setErrorMessage(this.formRef, errorMessage)
    }

    getValue() {
        const sizeModel: ISizeModel = {
            wt: parseFloat(this.formRef.width.current.getValue()),
            lt: parseFloat(this.formRef.length.current.getValue()),
            form_type: FormType.FORM_3
        } as ISizeModel
        return sizeModel
    }

    isChanged(): boolean {
        return FrameworkUtils.formHasChanged(this.formRef)
    }

    clear(): void {
        FrameworkUtils.formClear(this.formRef)
    }
    render() {
        return <FrameworkComponents.BaseForm title={this.props.title} small={this.props.small}>
            <FrameworkComponents.FormGroup>
                <FrameworkComponents.InputText 
                    placeHolder={this.props.languageContext.current.getMessageString(MessageId.WIDTH)}
                    ref={this.formRef.width}
                    validate={this.formValidate.width} />
                <FrameworkComponents.InputText
                    placeHolder={this.props.languageContext.current.getMessageString(MessageId.LENGTH)}
                    ref={this.formRef.length}
                    validate={this.formValidate.length} />
            </FrameworkComponents.FormGroup>
        </FrameworkComponents.BaseForm>
    }
}

export default Form3