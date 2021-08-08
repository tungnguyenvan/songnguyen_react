import FrameworkComponents from "framework/components/FrameworkComponents"
import React from "react"

class WarehouseImportByExcelFile extends React.Component {
    render() {
        return <FrameworkComponents.BasePage>
            <FrameworkComponents.FormGroup>
                <input type="file" />
            </FrameworkComponents.FormGroup>
        </FrameworkComponents.BasePage>
    }
}

export default WarehouseImportByExcelFile