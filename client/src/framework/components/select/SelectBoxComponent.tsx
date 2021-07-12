import React from "react"
import BaseFormControl from "../base/BaseFormControl"
import IFromInputElement from "../IFormInputElement"
import Style from "framework/resources/css/SelectBoxComponent.module.scss"
import ISelectOptionModel from "framework/documents/ui/ISelectOptionModel"
import FrameworkUtils from "framework/utils/FrameworkUtils"

interface SelectBoxComponentProps {
    placeHolder: string;
    options: ISelectOptionModel[];
    selectedId?: string | ""
}

class SelectBoxComponent extends React.Component<SelectBoxComponentProps> implements IFromInputElement {
    private rootRef: React.RefObject<any>
    private baseFormControl: React.RefObject<BaseFormControl>

    constructor(props: any) {
        super(props)

        this.rootRef = React.createRef();
        this.baseFormControl = React.createRef();

        this.clear = this.clear.bind(this)
        this.isValid = this.isValid.bind(this)
        this.getValue = this.getValue.bind(this)
        this.isChanged = this.isChanged.bind(this)
        this.setErrorMessage = this.setErrorMessage.bind(this)
        this.onFocusCallback = this.onFocusCallback.bind(this)
    }

    componentDidMount() {
        if (this.props.selectedId) {
            this.baseFormControl.current?.onFocus()
            this.baseFormControl.current?.onBlur()
        }
    }

    isValid(): boolean {
        return false
    }

    setErrorMessage(errorMessage: string): void {
        
    }

    getValue(): String | Number {
        return this.rootRef.current.value
    }

    isChanged(): boolean {
        return !FrameworkUtils.isBlank(this.getValue()) && this.props.selectedId !== this.getValue()
    }
    
    clear(): void {
        this.rootRef.current.value = ""
    }

    onFocusCallback() {
        this.rootRef.current.click()
    }
    
    render() {
        return <BaseFormControl
            getValue={this.getValue}
            onFocusCallback={this.onFocusCallback}
            placeHolder={this.props.placeHolder}
            ref={this.baseFormControl}>
            <select
                className={Style.select__box__component}
                ref={this.rootRef}
                onFocus={this.baseFormControl.current?.onFocus}
                onBlur={this.baseFormControl.current?.onBlur}
                onChange={() => {
                    this.baseFormControl.current?.onFocus()
                }}
                onSelect={this.baseFormControl.current?.onFocus}
                defaultValue={this.props.selectedId}>
                <option></option>
                {
                    this.props.options.map(element => {
                        return <option value={element.id} key={element.id}>{element.title}</option>
                    })
                }
            </select>
        </BaseFormControl>
    }
}

export default SelectBoxComponent