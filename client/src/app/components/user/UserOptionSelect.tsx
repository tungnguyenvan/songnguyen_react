import React from "react";
import ClassName from "classnames"
import Style from "app/resources/css/UserOptionSelect.module.scss"

interface UserOptionSelectProps {

}

interface UserOptionSelectState {
    isActive: boolean;
}

class UserOptionSelect extends React.Component<UserOptionSelectProps, UserOptionSelectState> {
    constructor(props: UserOptionSelectProps) {
        super(props);

        this.state = {
            isActive: false
        }
    }

    render() {
        const containerClass = ClassName(Style.user__option__select__container)

        return <div className={containerClass}></div>
    }
}

export default UserOptionSelect;