import AppDialogContext from "framework/contexts/dialog/AppDialogContext"
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext"
import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import LanguageContext from "framework/contexts/lang/LanguageContext"
import AppUrlContext from "framework/contexts/url/AppUrlContext"
import IAppUrlContext from "framework/contexts/url/IAppUrlContext"
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

function withAppUrl(Component: any) {
    return class extends React.Component {
        render() {
            return <AppUrlContext.Consumer>
                {(context: IAppUrlContext) => <Component {...this.props} appUrlContext={context} />}
            </AppUrlContext.Consumer>
        }
    }
}

function withAppDialog(Component: any) {
    return class extends React.Component {
        render() {
            return <AppDialogContext.Consumer>
                {(context: IAppDialogContext) => <Component {...this.props} appDialogContext={context} />}
            </AppDialogContext.Consumer>
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {withUserLogin, withLanguage, withAppUrl, withAppDialog}