import IStoreModel from "app/documents/IStoreModel"
import React from "react"
import IStoreContextFunc from "./IStoreContextFunc"
import StoreContext from "./StoreContext"

interface StoreProviderProps {}

interface StoreProviderState {
    storeSelected: IStoreModel
}

class StoreProvider extends React.Component<StoreProviderProps, StoreProviderState> implements IStoreContextFunc {

    constructor(props: StoreProviderProps) {
        super(props)

        this.state = {
            storeSelected: undefined as unknown as IStoreModel
        }
    }

    onSetStoreSelected(store: IStoreModel): void {
        if (!(this.state.storeSelected && store._id === this.state.storeSelected._id)) {
            this.setState({
                storeSelected: store
            })
        }
    }

    render() {
        return <StoreContext.Provider value={{
            storeSelected: this.state.storeSelected,
            current: this
        }}>{this.props.children}</StoreContext.Provider>
    }
}

export default StoreProvider