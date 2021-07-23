import IProductNameModel from "app/documents/IProductNameModel";
import IProductTypeModel from "app/documents/IProductTypeModel";
import ISizeModel from "app/documents/ISizeModel";
import IStandardModel from "app/documents/IStandardModel";
import ISystemStandardModel from "app/documents/ISystemStandardModel";
import IThicknessModel from "app/documents/IThicknessModel";
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
import SettingPageSupportSize from "./SettingPageSupportSize";
import SettingPageSupportStandard from "./SettingPageSupportStandard";
import SettingPageSupportSystemStandard from "./SettingPageSupportSystemStandard";
import SettingPageSupportThickness from "./SettingPageSupportThickness";

interface SettingPageProps {
    languageContext: ILanguageContext;
    appUrlContext: IAppUrlContext;
    appDialogContext: IAppDialogContext;
}

interface SettingPageState {
    productTypes: IProductTypeModel[]
    productNames: IProductNameModel[]
    thicknesses: IThicknessModel[]
    systemStandards: ISystemStandardModel[]
    standards: IStandardModel[],
    sizes: ISizeModel[]
}

class SettingPage extends React.Component<SettingPageProps, SettingPageState> {
    private settingPageSupportProductType: SettingPageSupportProductType
    private settingPageSupportProductName: SettingPageSupportProductName
    private settingPageSupportThickness: SettingPageSupportThickness
    private settingPageSupportSystemStandard: SettingPageSupportSystemStandard
    private settingPageSupportStandard: SettingPageSupportStandard
    private settingPageSupportSize: SettingPageSupportSize

    constructor(props: SettingPageProps) {
        super(props)

        this.state = {
            productTypes: [],
            productNames: [],
            thicknesses: [],
            systemStandards: [],
            standards: [],
            sizes: []
        }

        this.sizesRequestCallback = this.sizesRequestCallback.bind(this)
        this.productTypeRequestCallback = this.productTypeRequestCallback.bind(this)
        this.productNameRequestCallback = this.productNameRequestCallback.bind(this)
        this.thicknessRequestCallback = this.thicknessRequestCallback.bind(this)
        this.standardsRequestCallback = this.standardsRequestCallback.bind(this)
        this.SystemStandardRequestCallback = this.SystemStandardRequestCallback.bind(this)
        
        this.settingPageSupportProductType = new SettingPageSupportProductType(this.props.appUrlContext, this.props.appDialogContext, this.props.languageContext, this.productTypeRequestCallback)
        this.settingPageSupportProductName = new SettingPageSupportProductName(this.props.appUrlContext, this.props.appDialogContext, this.props.languageContext, this.productNameRequestCallback)
        this.settingPageSupportThickness = new SettingPageSupportThickness(this.props.appUrlContext, this.props.appDialogContext, this.props.languageContext, this.thicknessRequestCallback)
        this.settingPageSupportSystemStandard = new SettingPageSupportSystemStandard(this.props.appUrlContext, this.props.appDialogContext, this.props.languageContext, this.SystemStandardRequestCallback)
        this.settingPageSupportStandard = new SettingPageSupportStandard(this.props.appUrlContext, this.props.appDialogContext, this.props.languageContext, this.standardsRequestCallback)
        this.settingPageSupportSize = new SettingPageSupportSize(this.props.appUrlContext, this.props.appDialogContext, this.props.languageContext, this.sizesRequestCallback)
    }

    componentDidMount() {
        this.settingPageSupportProductType.all()
        this.settingPageSupportProductName.all()
        this.settingPageSupportThickness.all()
        this.settingPageSupportSystemStandard.all()
        this.settingPageSupportStandard.all()
        this.settingPageSupportSize.all()
    }

    thicknessRequestCallback(thicknesses: IThicknessModel[]) {
        this.setState({
            thicknesses: thicknesses
        })
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

    SystemStandardRequestCallback(systemStandards: ISystemStandardModel[]) {
        this.setState({
            systemStandards: systemStandards
        })
    }

    standardsRequestCallback(models: IStandardModel[]) {
        this.setState({
            standards: models
        })
    }

    sizesRequestCallback(models: ISizeModel[]) {
        this.setState({
            sizes: models
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

                <FrameworkComponents.Table {...{
                    title: this.props.languageContext.current.getMessageString(MessageId.THICKNESS),
                    header: this.settingPageSupportThickness.renderHeader(),
                    content: this.settingPageSupportThickness.renderTableContent(this.state.thicknesses),
                    commonButton: () => {
                        this.props.appUrlContext.redirectTo(RouteConstant.THICKNESS_CREATE)
                    }
                }} />

                <FrameworkComponents.Table {...{
                    title: this.props.languageContext.current.getMessageString(MessageId.SYSTEM_STANDARD),
                    header: this.settingPageSupportSystemStandard.renderHeader(),
                    content: this.settingPageSupportSystemStandard.renderTableContent(this.state.systemStandards),
                    commonButton: () => {
                        this.props.appUrlContext.redirectTo(RouteConstant.SYSTEM_STANDARD_CREATE)
                    }
                }} />

                <FrameworkComponents.Table {...{
                    title: this.props.languageContext.current.getMessageString(MessageId.STANDARD),
                    header: this.settingPageSupportStandard.renderHeader(),
                    content: this.settingPageSupportStandard.renderTableContent(this.state.standards),
                    commonButton: () => {
                        this.props.appUrlContext.redirectTo(RouteConstant.STANDARD_CREATE)
                    }
                }} />

                <FrameworkComponents.Table {...{
                    title: this.props.languageContext.current.getMessageString(MessageId.SIZE),
                    header: this.settingPageSupportSize.renderHeader(),
                    content: this.settingPageSupportSize.renderTableContent(this.state.sizes),
                    commonButton: () => {
                        this.props.appUrlContext.redirectTo(RouteConstant.SIZE_CREATE)
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