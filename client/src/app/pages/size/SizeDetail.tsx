import ProductTypeApiService from "app/api/ProductTypeApiService"
import SizeApiService from "app/api/SizeApiService"
import Form1 from "app/components/form/Form1"
import IProductTypeModel from "app/documents/IProductTypeModel"
import ISizeModel from "app/documents/ISizeModel"
import AppRenderUtils from "app/utils/AppRenderUtils"
import FrameworkComponents from "framework/components/FrameworkComponents"
import IFormInputElement from "framework/components/IFormInputElement"
import { FormType } from "framework/constants/AppEnumConstant"
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
import FrameworkUtils from "framework/utils/FrameworkUtils"
import React from "react"

interface SizeDetailProps {
    languageContext: ILanguageContext
    appDialogContext: IAppDialogContext
    appUrlContext: IAppUrlContext
}

interface SizeDetailState {
    productTypes: IProductTypeModel[]
    formType: FormType
    size: ISizeModel
}

interface ISizeFormRef {
    selectBoxProductType: React.RefObject<any>
    inputName: React.RefObject<any>
    form: React.RefObject<any>
}

interface IParams {
    id: string
}

class SizeDetail extends React.Component<SizeDetailProps, SizeDetailState> {
    private sizeApiService: SizeApiService
    private productTypeApiService: ProductTypeApiService
    private sizeFormRef: ISizeFormRef

    constructor(props: SizeDetailProps) {
        super(props)

        this.sizeFormRef = {
            selectBoxProductType: React.createRef<IFormInputElement>(),
            inputName: React.createRef<IFormInputElement>(),
            form: React.createRef<IFormInputElement>()
        }
        this.sizeApiService = new SizeApiService()
        this.productTypeApiService = new ProductTypeApiService()

        this.state = {
            productTypes: [],
            formType: undefined as unknown as FormType,
            size: {} as ISizeModel
        }

        this.onUpdate = this.onUpdate.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.requestApi = this.requestApi.bind(this)
        this.onProductTypeChanged = this.onProductTypeChanged.bind(this)
    }

    componentDidMount() {
        // get product type
        this.productTypeApiService.all()
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        productTypes: response.data.data as IProductTypeModel[]
                    })
                }
            })

        // get size infomation
        const path = FrameworkUtils.matchPath(window.location.pathname, RouteConstant.SIZE_DETAIL)
        if (path) {
            this.requestApi((path.params as IParams).id)
        }
    }

    onProductTypeChanged(selectedId: string): void {
        this.state.productTypes.forEach(element => {
            if (element._id === selectedId) {
                this.setState({
                    formType: element.form_type
                })
            }
        })
    }

    requestApi(id: string) {
        this.sizeApiService.get(id)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        size: response.data.data as ISizeModel,
                        formType: ((response.data.data as ISizeModel).product_type as IProductTypeModel).form_type
                    })
                }
            })
    }

    onDelete() {
        this.sizeApiService.delete(this.state.size._id)
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
        if (!FrameworkUtils.formHasChanged(this.sizeFormRef)) {
            this.props.appDialogContext.addDialog({
                title: this.props.languageContext.current.getMessageString(MessageId.FORM_NOT_CHANGE),
                content: this.props.languageContext.current.getMessageString(MessageId.FORM_NOT_CHANGE_DETAIL)
            })
        }

        if (FrameworkUtils.validateFrom(this.sizeFormRef) && FrameworkUtils.formHasChanged(this.sizeFormRef)) {
            const sizeModel: ISizeModel = this.sizeFormRef.form.current.getValue()
            sizeModel.name = this.sizeFormRef.inputName.current.getValue()
            sizeModel.product_type = this.sizeFormRef.selectBoxProductType.current.getValue()

            this.sizeApiService.update(this.state.size._id, sizeModel)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS),
                        content: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS_DETAIL)
                    })

                    this.requestApi(this.state.size._id)
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
        return <FrameworkComponents.BasePage {...{
            title: this.props.languageContext.current.getMessageString(MessageId.SIZE_DETAIL)
        }}>
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        ref={this.sizeFormRef.selectBoxProductType}
                        required={true}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.PRODUCT_TYPE)}
                        options={AppRenderUtils.renderProductTypeSelectBox(this.state.productTypes)}
                        onChanged={this.onProductTypeChanged}
                        selectedId={this.state.size.product_type ? (this.state.size.product_type as IProductTypeModel)._id : ""} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        ref={this.sizeFormRef.inputName}
                        value={this.state.size.name}
                        validate={[new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)]}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.NAME)} />
                </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>

            {this.state.formType === FormType.FORM_1 &&
            <Form1
                ref={this.sizeFormRef.form}
                size={this.state.size}
                isCalculatorModel={false}
                languageContext={this.props.languageContext} /> }

            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        readOnly={true}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.EMPLOYEE)}
                        value={FrameworkUtils.userName(this.state.size.createdBy)} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.DANGER}
                        onClick={this.onDelete}
                        dialogModel={{
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE_DETAIL)
                        }}>
                        {this.props.languageContext.current.getMessageString(MessageId.CANCEL)}
                    </FrameworkComponents.Button>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.PRIMARY}
                        onClick={this.onUpdate}
                        dialogModel={{
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_UPDATE_DETAIL)
                        }}>
                        {this.props.languageContext.current.getMessageString(MessageId.UPDATE)}
                    </FrameworkComponents.Button>
                </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>
        </FrameworkComponents.BasePage>
    }
}

export default WithFramework.withLanguage(
    WithFramework.withAppDialog(
        WithFramework.withAppUrl(SizeDetail)
    )
)