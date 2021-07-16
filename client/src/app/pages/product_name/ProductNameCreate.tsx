import FrameworkComponents from "framework/components/FrameworkComponents"
import React from "react"

class ProductNameCreate extends React.Component {
    render() {
        return <FrameworkComponents.BasePage {...{
            title: 'Create new Product name'
        }}>

        </FrameworkComponents.BasePage>
    }
}

export default ProductNameCreate