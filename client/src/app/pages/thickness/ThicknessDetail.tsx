import ProductNameApiService from "app/api/ProductNameApiService"
import ThicknessApiService from "app/api/ThicknessApiService"
import IProductNameModel from "app/documents/IProductNameModel"
import IThicknessModel from "app/documents/IThicknessModel"
import FrameworkComponents from "framework/components/FrameworkComponents"
import IFromInputElement from "framework/components/IFormInputElement"
import AppConstant from "framework/constants/AppConstant"
import ButtonTypeConstant from "framework/constants/ButtonTypeConstant"
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode"
import MessageId from "framework/constants/MessageId"
import RouteConstant from "framework/constants/RouteConstant"
import RuleConstant from "framework/constants/RuleConstant"
import WithFramework from "framework/constants/WithFramework"
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext"
import ILanguageContext from "framework/contexts/lang/ILanguageContext"
import IAppUrlContext from "framework/contexts/url/IAppUrlContext"
import Rule from "framework/documents/models/Rule"
import ISelectOptionModel from "framework/documents/ui/ISelectOptionModel"
import FrameworkUtils from "framework/utils/FrameworkUtils"
import React from "react"
import { ThicknessFormRef, ThicknessFormValidate } from "./ThicknessFormDefinition"

interface ThicknessDetailProps {
    languageContext: ILanguageContext
    appDialogContext: IAppDialogContext
    appUrlContext: IAppUrlContext
}

interface ThicknessDetailState {
    productNames: IProductNameModel[]
    thickness: IThicknessModel
}

interface PageParams {
    id: string
}

class ThicknessDetail extends React.Component<ThicknessDetailProps, ThicknessDetailState> {
    private productNameApiService: ProductNameApiService;
    private thicknessApiService: ThicknessApiService;
    private thicknessFormRef: ThicknessFormRef;
    private thicknessFormValidate: ThicknessFormValidate;

    constructor(props: ThicknessDetailProps) {
        super(props)

        this.state = {
            productNames: [],
            thickness: {} as IThicknessModel
        }

        this.thicknessFormRef = {
            inputName: React.createRef<IFromInputElement>(),
            inputPrice: React.createRef<IFromInputElement>(),
            selectBoxProductName: React.createRef<IFromInputElement>()
        }
        this.thicknessFormValidate = {
            inputName: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)],
            inputPrice: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_NUMBER, new RegExp(AppConstant.ONLY_NUMBER_REGEXP))],
            selectBoxProductName: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)]
        }
        this.productNameApiService = new ProductNameApiService()
        this.thicknessApiService = new ThicknessApiService()

        this.renderSelectBoxOption = this.renderSelectBoxOption.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
    }

    componentDidMount() {
        const params = FrameworkUtils.matchPath(window.location.pathname, RouteConstant.THICKNESS_DETAIL)
        if (FrameworkUtils.isAlive(params)) {
            this.requestThickness((params?.params as PageParams).id)
        }

        this.productNameApiService.all()
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        productNames: response.data.data as IProductNameModel[]
                    })
                }
            })
    }

    requestThickness(id: string) {
        this.thicknessApiService.get(id)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        thickness: response.data.data as IThicknessModel
                    })
                }
            })
    }

    renderSelectBoxOption(): ISelectOptionModel[] {
        const selectOptions: ISelectOptionModel[] = []

        this.state.productNames.forEach(element => {
            selectOptions.push({
                id: element._id,
                title: element.name
            })
        })

        return selectOptions
    }

    onDelete() {
        this.thicknessApiService.delete(this.state.thickness._id)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS),
                        content: this.props.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS_DETAIL)
                    })

                    this.props.appUrlContext.back()
                } else {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.CANNOT_DELETE),
                        content: this.props.languageContext.current.getMessageString(MessageId.CANNOT_DELETE_DETAIL)
                    })
                }
            })
            .catch(error => {
                this.props.appDialogContext.addDialog({
                    title: this.props.languageContext.current.getMessageString(MessageId.CANNOT_DELETE),
                    content: this.props.languageContext.current.getMessageString(MessageId.CANNOT_DELETE_DETAIL)
                })
            })
    }

    onUpdate() {
        if (!FrameworkUtils.formHasChanged(this.thicknessFormRef)) {
            this.props.appDialogContext.addDialog({
                title: this.props.languageContext.current.getMessageString(MessageId.FORM_NOT_CHANGE),
                content: this.props.languageContext.current.getMessageString(MessageId.FORM_NOT_CHANGE_DETAIL)
            })
        }

        if (FrameworkUtils.validateFrom(this.thicknessFormRef) && FrameworkUtils.formHasChanged(this.thicknessFormRef)) {
            const thicknessModel: IThicknessModel = {
                name: this.thicknessFormRef.inputName.current.getValue(),
                price: this.thicknessFormRef.inputPrice.current.getValue(),
                product_name: this.thicknessFormRef.selectBoxProductName.current.getValue()
            } as IThicknessModel

            this.thicknessApiService.update(this.state.thickness._id, thicknessModel)
                .then(response => {
                    if (response.status === HttpRequestStatusCode.OK) {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS),
                            content: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS_DETAIL)
                        })
                    } else {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE_DETAIL)
                        })
                    }
                })
                .catch(error => {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE),
                        content: this.props.languageContext.current.getMessageString(MessageId.CANNOT_UPDATE_DETAIL)
                    })
                })
        }
    }

    render() {
        return  <FrameworkComponents.BasePage {...{
            title: this.props.languageContext.current.getMessageString(MessageId.THICKNESS_DETAIL)
        }}>
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        ref={this.thicknessFormRef.inputName}
                        value={this.state.thickness.name}
                        validate={this.thicknessFormValidate.inputName}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.NAME)} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        ref={this.thicknessFormRef.inputPrice}
                        value={this.state.thickness.price ? this.state.thickness.price.toString(): ''}
                        validate={this.thicknessFormValidate.inputPrice}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.M2_PRICE)} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        required={true}
                        ref={this.thicknessFormRef.selectBoxProductName}
                        selectedId={this.state.thickness.product_name ? (this.state.thickness.product_name as IProductNameModel)._id : undefined}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_NAME)}
                        options={this.renderSelectBoxOption()} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        readOnly={true}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.EMPLOYEE)}
                        value={FrameworkUtils.userName(this.state.thickness.createdBy)} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.DANGER}
                        onClick={this.onDelete}
                        dialogModel={{
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE_DETAIL)
                        }}>
                        {this.props.languageContext.current.getMessageString(MessageId.DELETE)}
                    </FrameworkComponents.Button>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.PRIMARY}
                        dialogModel={{
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE_DETAIL)
                        }}
                        onClick={this.onUpdate}>
                        {this.props.languageContext.current.getMessageString(MessageId.UPDATE)}
                    </FrameworkComponents.Button>
                </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>
        </FrameworkComponents.BasePage>
    }
}

export default WithFramework.withLanguage(
    WithFramework.withAppDialog(
        WithFramework.withAppUrl(ThicknessDetail)
    )
)