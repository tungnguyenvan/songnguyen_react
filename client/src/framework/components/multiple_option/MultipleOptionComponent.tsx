import React from "react"
import ClassNames from "classnames"
import IFromInputElement from "../IFormInputElement"
import Style from "framework/resources/css/MultipleOptionComponent.module.scss"
import MultipleOptionItemComponent from "./MultipleOptionItemComponent"
import IMultipleOptionModel from "framework/documents/ui/IMultipleOptionItemModel"

interface MultipleOptionComponentProps {
    options: IMultipleOptionModel[]
    title: string
    required?: boolean;
    errorMessageRequired?: string
    defaultValue: IMultipleOptionModel[]
}

interface MultipleOptionComponentState {
    options: IMultipleOptionModel[];
    errorMessage: string
}

class MultipleOptionComponent extends React.Component<MultipleOptionComponentProps, MultipleOptionComponentState> implements IFromInputElement {

    constructor(props: MultipleOptionComponentProps) {
        super(props)

        this.state = {
            options: [...this.props.options],
            errorMessage: ''
        }

        this.onOptionSelect = this.onOptionSelect.bind(this)
    }

    isValid(): boolean {
        if (!this.props.required) return true

        let isValid = false

        this.state.options.forEach(element => {
            if (element.isSelected) {
                isValid = true
            }
        })

        if (!isValid) {
            if (this.props.errorMessageRequired) {
                this.setState({
                    errorMessage: this.props.errorMessageRequired
                })
            }
        }

        return isValid
    }

    setErrorMessage(errorMessage: string): void {
        this.setState({
            errorMessage: errorMessage
        })
    }

    getValue(): IMultipleOptionModel[] {
        return this.state.options
    }

    isChanged(): boolean {
        let isChanged = false

        this.state.options.forEach((element, index) => {
            if (this.props.defaultValue[index].isSelected !== element.isSelected) {
                isChanged = true
            }
        })

        return isChanged
    }
    
    clear(): void {
        const options = this.state.options
        options.forEach(element => {
            element.isSelected = false
        })

        this.setState({
            options: options
        })
    }

    componentDidUpdate(prevProps: MultipleOptionComponentProps) {
        if (prevProps.options !== this.props.options) {
            this.setState({
                options: [...this.props.options]
            })
        }
    }

    onOptionSelect(id: string) {
        this.setState({
            errorMessage: ''
        })

        const options = this.state.options
        options.forEach(element => {
            if (element.id === id) {
                element.isSelected = !element.isSelected
            }
        })

        this.setState({
            options: options
        })
    }

    render() {
        const classNames = ClassNames(Style.multiple__option__component, {
            [Style.error]: this.state.errorMessage
        })

        return (
        <div className={classNames}>
            <div className={Style.multiple__option__title}>
                <h3>{this.props.title}</h3>
            </div>
            <div className={Style.multiple__options}>
                {
                    this.state.options.map(element => {
                        return <MultipleOptionItemComponent key={element.id} option={element} onSelect={this.onOptionSelect} />
                    })
                }
            </div>
            <div className={Style.multiple__option__error}>
                <span>{this.state.errorMessage}</span>
            </div>
        </div>)
    }
}

export default MultipleOptionComponent