import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import LanguageContext from "framework/contexts/lang/LanguageContext"
import IUserLoginContext from "framework/contexts/user/IUserLoginContext"
import UserLoginContext from "framework/contexts/user/UserLoginContext"
import React from "react"

class StoreSelectCosumerContext extends React.Component {
    userLoginContext!: IUserLoginContext
    languageContext!: ILanguageContext
    
    render() {
        return <UserLoginContext.Consumer>
            {context => {
                this.userLoginContext = context
                return (
                    <LanguageContext.Consumer>
                        {context => {
                            return this.props.children
                        }}
                    </LanguageContext.Consumer>)
            }}
        </UserLoginContext.Consumer>
    }
}

export default StoreSelectCosumerContext