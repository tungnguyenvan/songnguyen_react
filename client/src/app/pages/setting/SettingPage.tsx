import IProductNameModel from "app/documents/IProductNameModel";
import IProductTypeModel from "app/documents/IProductTypeModel";
import FrameworkComponents from "framework/components/FrameworkComponents";
import MessageId from "framework/constants/MessageId";
import RouteConstant from "framework/constants/RouteConstant";
import WithFramework from "framework/constants/WithFramework";
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import IAppUrlContext from "framework/contexts/url/IAppUrlContext";
import React from "react";
import SettingPageSupportProductName from "./SettingPageSupportProductName";
import SettingPageSupportProductType from "./SettingPageSupportProductType";

interface SettingPageProps {
    languageContext: ILanguageContext;
    appUrlContext: IAppUrlContext;
    appDialogContext: IAppDialogContext;
}

interface SettingPageState {
    productTypes: IProductTypeModel[]
    productNames: IProductNameModel[]
}

class SettingPage extends React.Component<SettingPageProps, SettingPageState> {
    private settingPageSupportProductType: SettingPageSupportProductType
    private settingPageSupportProductName: SettingPageSupportProductName

    constructor(props: SettingPageProps) {
        super(props)

        this.state = {
            productTypes: [],
            productNames: []
        }

        this.productTypeRequestCallback = this.productTypeRequestCallback.bind(this)
        this.productNameRequestCallback = this.productNameRequestCallback.bind(this)
        this.settingPageSupportProductType = new SettingPageSupportProductType(this.props.appUrlContext, this.props.appDialogContext, this.props.languageContext, this.productTypeRequestCallback)
        this.settingPageSupportProductName = new SettingPageSupportProductName(this.props.appUrlContext, this.props.appDialogContext, this.props.languageContext, this.productNameRequestCallback)
    }

    componentDidMount() {
        this.settingPageSupportProductType.all()
        this.settingPageSupportProductName.all()
    }

    productTypeRequestCallback(productTypes: IProductTypeModel[]) {
        this.setState({
            productTypes: productTypes
        })
    }

    productNameRequestCallback(productNames: IProductNameModel[]) {
        this.setState({
            productNames: productNames
        })
    }

    render() {
        return <FrameworkComponents.BasePage {...{title: this.props.languageContext.current.getMessageString(MessageId.SETTING)}}>
                <FrameworkComponents.Table {...{
                    title: this.props.languageContext.current.getMessageString(MessageId.PRODUCT_TYPE),
                    header: this.settingPageSupportProductType.renderHeader(),
                    content: this.settingPageSupportProductType.renderTableContent(this.state.productTypes),
                    commonButton: () => {
                        this.props.appUrlContext.redirectTo(RouteConstant.PRODUCT_TYPE_CREATE)
                    }
                }} />

                <FrameworkComponents.Table {...{
                    title: this.props.languageContext.current.getMessageString(MessageId.PRODUCT_NAME),
                    header: this.settingPageSupportProductName.renderHeader(),
                    content: this.settingPageSupportProductName.renderTableContent(this.state.productNames),
                    commonButton: () => {
                        this.props.appUrlContext.redirectTo(RouteConstant.PRODUCT_NAME_CREATE)
                    }
                }} />
        </FrameworkComponents.BasePage>
    }
}

export default WithFramework.withLanguage(
    WithFramework.withAppUrl(
        WithFramework.withAppDialog(SettingPage)
    )
)