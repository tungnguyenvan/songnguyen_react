import React from "react"
import IFromInputElement from "../IFormInputElement"
import Style from "framework/resources/css/MultipleOptionComponent.module.scss"
import MultipleOptionItemComponent from "./MultipleOptionItemComponent"
import IMultipleOptionModel from "framework/documents/ui/IMultipleOptionItemModel"

interface MultipleOptionComponentProps {
    options: IMultipleOptionModel[]
    title: string
}

interface MultipleOptionComponentState {
    options: IMultipleOptionModel[]
}

class MultipleOptionComponent extends React.Component<MultipleOptionComponentProps, MultipleOptionComponentState> implements IFromInputElement {

    constructor(props: MultipleOptionComponentProps) {
        super(props)

        this.state = {
            options: this.props.options
        }

        this.onOptionSelect = this.onOptionSelect.bind(this)
    }

    isValid(): boolean {
        throw new Error("Method not implemented.")
    }
    setErrorMessage(errorMessage: string): void {
        throw new Error("Method not implemented.")
    }
    getValue(): String | Number {
        throw new Error("Method not implemented.")
    }
    isChanged(): boolean {
        throw new Error("Method not implemented.")
    }
    clear(): void {
        throw new Error("Method not implemented.")
    }

    componentDidUpdate(prevProps: MultipleOptionComponentProps) {
        if (prevProps.options.length !== this.props.options.length) {
            this.setState({
                options: this.props.options
            })
        }
    }

    onOptionSelect(id: string) {
        const options = this.state.options
        options.forEach((element, index) => {
            if (element.id === id) {
                element.isSelected = !element.isSelected
            }
        })

        this.setState({
            options: options
        })
    }

    render() {
        return (
        <div className={Style.multiple__option__component}>
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
        </div>)
    }
}

export default MultipleOptionComponent