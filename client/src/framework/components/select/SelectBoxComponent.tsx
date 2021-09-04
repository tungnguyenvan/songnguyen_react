import React from "react"
import BaseFormControl from "../base/BaseFormControl"
import IFormInputElement from "../IFormInputElement"
import Style from "framework/resources/css/SelectBoxComponent.module.scss"
import ISelectOptionModel from "framework/documents/ui/ISelectOptionModel"
import FrameworkUtils from "framework/utils/FrameworkUtils"

interface SelectBoxComponentProps {
    placeHolder: string;
    options: ISelectOptionModel[];
    disable?: boolean
    selectedId?: string
    required?: boolean
    errorMessage?: string
    onChanged?: (selectedId: string) => void;
}

interface SelectBoxComponentState {
    selectedId: string
}

class SelectBoxComponent extends React.Component<SelectBoxComponentProps, SelectBoxComponentState> implements IFormInputElement {
    private rootRef: React.RefObject<any>
    private baseFormControl: React.RefObject<BaseFormControl>

    constructor(props: any) {
        super(props)

        this.state = {
            selectedId: this.props.selectedId ? this.props.selectedId : ""
        }

        this.rootRef = React.createRef();
        this.baseFormControl = React.createRef();

        this.onChange = this.onChange.bind(this)
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

    componentDidUpdate(prevProps: SelectBoxComponentProps) {
        this.baseFormControl.current?.onFocus()
        this.baseFormControl.current?.onBlur()
        if (this.state.selectedId !== this.props.selectedId && prevProps.selectedId !== this.props.selectedId) {
            this.setState({
                selectedId: this.props.selectedId ? this.props.selectedId : ""
            }, () => {
                this.baseFormControl.current?.onFocus()
                this.baseFormControl.current?.onBlur()
            })
        }
    }

    isValid(): boolean {
        if (!this.props.required || this.props.disable) return true

        if (!FrameworkUtils.isBlank(this.getValue())) {
            this.setErrorMessage("")
            return true
        }

        if (this.props.errorMessage) {
            this.setErrorMessage(this.props.errorMessage)
        }
        return false
    }

    setErrorMessage(errorMessage: string): void {
        this.baseFormControl.current?.setErrorMessage(errorMessage)
    }

    getValue(): String | Number {
        return this.rootRef.current ? this.rootRef.current.value: false
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

    onChange() {
        this.setErrorMessage("")
        this.setState({
            selectedId: this.getValue().toString()
        }, () => {
            if (this.props.onChanged) {
                this.props.onChanged(this.state.selectedId)
            }
        })
    }
    
    render() {
        return <BaseFormControl
            getValue={this.getValue}
            onFocusCallback={this.onFocusCallback}
            placeHolder={this.props.placeHolder}
            disable={this.props.disable}
            ref={this.baseFormControl}>
            <select
                className={Style.select__box__component}
                ref={this.rootRef}
                onFocus={this.baseFormControl.current?.onFocus}
                onBlur={this.baseFormControl.current?.onBlur}
                onChange={() => {
                    this.onChange()
                    this.baseFormControl.current?.onFocus()
                }}
                onSelect={this.baseFormControl.current?.onFocus}
                value={this.state.selectedId}
                disabled={this.props.disable}>
                <option disabled={(this.props.selectedId && this.props.selectedId !== "") as boolean}></option>
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