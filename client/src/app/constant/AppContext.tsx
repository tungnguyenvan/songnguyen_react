import React from "react"
import StoreContext from "app/context/store/StoreContext"
import IStoreContext from "app/context/store/IStoreContext"

const withRouterStoreSelectContext = (Component: any) => {
    return class extends React.Component {
        render() {
            return <StoreContext.Consumer>
                {(context: IStoreContext) => <Component {...this.props} storeContext={context} />}
            </StoreContext.Consumer>
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {withRouterStoreSelectContext}