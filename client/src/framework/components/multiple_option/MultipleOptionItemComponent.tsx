import React from "react"
import ClassNames from "classnames"
import Style from "framework/resources/css/MultipleOptionComponent.module.scss"
import { ReactComponent as Circle } from "framework/resources/image/circle.svg"
import { ReactComponent as CheckedCircle } from "framework/resources/image/check-circle.svg"
import IMultipleOptionModel from "framework/documents/ui/IMultipleOptionItemModel"

interface MultipleOptionItemComponentProps {
    option: IMultipleOptionModel;
    onSelect: (id: string) => void
}

class MultipleOptionItemComponent extends React.Component<MultipleOptionItemComponentProps> {
    render() {

        const className = ClassNames(Style.option__in__multiple__option, {
            [Style.selected]: this.props.option.isSelected
        })

        return (
        <div className={className} onClick={() => {
            if (this.props.onSelect) this.props.onSelect(this.props.option.id)
        }}>
            { !this.props.option.isSelected ? <Circle className={Style.option_icon} /> : <CheckedCircle className={Style.option_icon} />}
            <div className={Style.option__detail}>
                <span>{this.props.option.title}</span>
                <span className={Style.option__detail__explain}>{this.props.option.detail}</span>
            </div>
        </div>)
    }
}

export default MultipleOptionItemComponent