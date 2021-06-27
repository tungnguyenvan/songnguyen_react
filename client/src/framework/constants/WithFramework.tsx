import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import LanguageContext from "framework/contexts/lang/LanguageContext"
import IUserLoginContext from "framework/contexts/user/IUserLoginContext"
import UserLoginContext from "framework/contexts/user/UserLoginContext"
import React from "react"

function withUserLogin(Component: any) {
    return class extends React.Component {
        render() {
            return <UserLoginContext.Consumer>
                {(context: IUserLoginContext) => <Component {...this.props} userLoginContext={context} />}
            </UserLoginContext.Consumer>
        }
    }
}

function withLanguage(Component: any) {
    return class extends React.Component {
        render() {
            return <LanguageContext.Consumer>
                {(context: ILanguageContext) => <Component {...this.props} languageContext={context} /> }
            </LanguageContext.Consumer>
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {withUserLogin, withLanguage}