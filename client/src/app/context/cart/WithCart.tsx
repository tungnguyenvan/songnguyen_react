import React from "react"
import CartContext from "./CartContext"
import ICartContext from "./ICartContext"

function WithCart(Component: any) {
    return class extends React.Component {
        render() {
            return <CartContext.Consumer>
                {(context: ICartContext) => <Component {...this.props} cartContext={context} />}
            </CartContext.Consumer>
        }
    }
}

export default WithCart