import CartComponent from "app/components/card/CartComponent"
import ICartModel from "app/documents/ICartModel"
import WithFramework from "framework/constants/WithFramework"
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext"
import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import IAppUrlContext from "framework/contexts/url/IAppUrlContext"
import IUserLoginContext from "framework/contexts/user/IUserLoginContext"
import React from "react"
import CartContext from "./CartContext"
import ICartContextFunc from "./ICartContextFunc"

interface CartProviderProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    appUrlContext: IAppUrlContext;
    userLoginContext: IUserLoginContext;
}

class CartProvider extends React.Component<CartProviderProps> implements ICartContextFunc {
    private cartComponentRef: React.RefObject<any>

    constructor(props: any) {
        super(props)

        this.cartComponentRef = React.createRef()
        this.onRefresh = this.onRefresh.bind(this)
        this.getIdCartSelected = this.getIdCartSelected.bind(this)
    }

    getCurrentCart(): ICartModel {
        return this.cartComponentRef.current.getCurrentCart()
    }

    onRefresh(): void {
        this.cartComponentRef.current.requestCartApi()
    }

    getIdCartSelected(): string {
        return this.cartComponentRef.current.getIdCartSelected()
    }

    render() {
        return <CartContext.Provider value={{
            current: this
        }}>
            {this.props.children}
            <CartComponent
                ref={this.cartComponentRef}
                {...this.props} />
        </CartContext.Provider>
    }
}

export default WithFramework.withLanguage(
    WithFramework.withAppDialog(
        WithFramework.withAppUrl(
            WithFramework.withUserLogin(
                CartProvider
            )
        )
    )
)