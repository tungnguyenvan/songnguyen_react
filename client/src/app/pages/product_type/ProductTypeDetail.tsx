import ProductTypeApiService from "app/api/ProductTypeApiService"
import IProductTypeModel from "app/documents/IProductTypeModel"
import AppRenderUtils from "app/utils/AppRenderUtils"
import FrameworkComponents from "framework/components/FrameworkComponents"
import IFormInputElement from "framework/components/IFormInputElement"
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
import { IProductTypeFormRef, IProductTypeFormValidate } from "./ProductTypeFormDefinition"

interface ProductTypeDetailProps {
    languageContext: ILanguageContext;
    appDialogContext: IAppDialogContext;
    appUrlContext: IAppUrlContext;
}

interface ProductTypeDetailState {
    productType: IProductTypeModel
}

interface IParam {
    id: string
}

class ProductTypeDetail extends React.Component<ProductTypeDetailProps, ProductTypeDetailState> {
    private productTypeApiService: ProductTypeApiService;
    private productTypeFormRef: IProductTypeFormRef;
    private productTypeFormValidate: IProductTypeFormValidate;

    constructor(props: ProductTypeDetailProps) {
        super(props)

        this.productTypeApiService = new ProductTypeApiService();

        this.state = {
            productType: {} as IProductTypeModel
        }
        this.productTypeFormRef = {
            inputName: React.createRef<IFormInputElement>(),
            formTypeSelectBox: React.createRef<IFormInputElement>(),
            unit: React.createRef<IFormInputElement>()
        }
        this.productTypeFormValidate = {
            inputName: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)],
            formTypeSelectBox: [],
            unit: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)]
        }

        this.onUpdate = this.onUpdate.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.requestApi = this.requestApi.bind(this)
    }

    componentDidMount() {
        const path = FrameworkUtils.matchPath(window.location.pathname, RouteConstant.PRODUCT_TYPE_DETAIL)
        if (path) {
            this.requestApi((path.params as IParam).id)
        }
    }

    requestApi(id: string) {
        this.productTypeApiService.get(id)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        productType: response.data.data as IProductTypeModel
                    })
                }
            })
    }

    onDelete() {
        this.productTypeApiService.delete(this.state.productType._id)
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
        if (!FrameworkUtils.formHasChanged(this.productTypeFormRef)) {
            this.props.appDialogContext.addDialog({
                title: this.props.languageContext.current.getMessageString(MessageId.FORM_NOT_CHANGE),
                content: this.props.languageContext.current.getMessageString(MessageId.FORM_NOT_CHANGE_DETAIL)
            })
        }

        if (FrameworkUtils.validateFrom(this.productTypeFormRef) && FrameworkUtils.formHasChanged(this.productTypeFormRef)) {
            const model: IProductTypeModel = {
                name: this.productTypeFormRef.inputName.current.getValue(),
                form_type: this.productTypeFormRef.formTypeSelectBox.current.getValue(),
                unit: this.productTypeFormRef.unit.current.getValue()
            } as IProductTypeModel

            this.productTypeApiService.update(this.state.productType._id, model)
                .then(response => {
                    if (response.status === HttpRequestStatusCode.OK) {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS),
                            content: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS_DETAIL)
                        })

                        this.requestApi(this.state.productType._id)
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
    }

    render() {
        return <FrameworkComponents.BasePage {...{
            title: this.props.languageContext.current.getMessageString(MessageId.PRODUCT_TYPE_DETAIL)
        }}>
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        ref={this.productTypeFormRef.inputName}
                        validate={this.productTypeFormValidate.inputName}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.NAME)}
                        value={this.state.productType.name} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        ref={this.productTypeFormRef.unit}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.UNIT)}
                        validate={this.productTypeFormValidate.unit}
                        value={this.state.productType.unit} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        ref={this.productTypeFormRef.formTypeSelectBox}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.FORM_TYPE)}
                        options={AppRenderUtils.renderFormType()}
                        selectedId={this.state.productType.form_type}
                        required={true}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        readOnly={true}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.EMPLOYEE)}
                        value={FrameworkUtils.userName(this.state.productType.createdBy)} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.DANGER}
                        dialogModel={{
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE_DETAIL)
                        }}
                        onClick={this.onDelete}>
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
        WithFramework.withAppUrl(ProductTypeDetail)
    )
)