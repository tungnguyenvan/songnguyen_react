import SizeApiService from "app/api/SizeApiService"
import StandardApiService from "app/api/StandardApiService"
import SystemStandardApiService from "app/api/SystemStandardApiService"
import Form1 from "app/components/form/Form1"
import IProductTypeModel from "app/documents/IProductTypeModel"
import ISizeModel from "app/documents/ISizeModel"
import IStandardModel from "app/documents/IStandardModel"
import ISystemStandardModel from "app/documents/ISystemStandardModel"
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

interface SizeCreateProps {
    languageContext: ILanguageContext
    appDialogContext: IAppDialogContext
    appUrlContext: IAppUrlContext
}

interface SizeCreateState {
    productTypes: IProductTypeModel[]
    formType: FormType,
    systemStandards: ISystemStandardModel[],
    standards: IStandardModel[]
}

interface ISizeFormRef {
    systemStandard: React.RefObject<any>
    standard: React.RefObject<any>
    selectBoxProductType: React.RefObject<any>
    inputName: React.RefObject<any>
    form: React.RefObject<any>
}

class SizeCreate extends React.Component<SizeCreateProps, SizeCreateState> {
    private sizeApiService: SizeApiService
    private sizeFormRef: ISizeFormRef
    private systemStandardApiService: SystemStandardApiService;
    private standardApiService: StandardApiService;

    constructor(props: SizeCreateProps) {
        super(props)

        this.sizeFormRef = {
            systemStandard: React.createRef<IFormInputElement>(),
            standard: React.createRef<IFormInputElement>(),
            selectBoxProductType: React.createRef<IFormInputElement>(),
            inputName: React.createRef<IFormInputElement>(),
            form: React.createRef<IFormInputElement>()
        }

        this.state = {
            productTypes: [],
            formType: undefined as unknown as FormType,
            systemStandards: [],
            standards: []
        }

        this.sizeApiService = new SizeApiService()
        this.systemStandardApiService = new SystemStandardApiService();
        this.standardApiService = new StandardApiService();
        this.onCancel = this.onCancel.bind(this)
        this.onRegistration = this.onRegistration.bind(this)
        this.onProductTypeChanged = this.onProductTypeChanged.bind(this)
        this.systemStandardSelectBoxHasChanged = this.systemStandardSelectBoxHasChanged.bind(this)
    }

    componentDidMount() {
        // get product type
        this.systemStandardApiService.all()
            .then(response => {
                this.setState({
                    systemStandards: response.data.data as ISystemStandardModel[]
                })
            })
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

    onCancel() {
        FrameworkUtils.formClear(this.sizeFormRef)
    }

    onRegistration() {
        if (FrameworkUtils.validateFrom(this.sizeFormRef)) {
            const sizeModel: ISizeModel = this.sizeFormRef.form.current.getValue()
            sizeModel.name = this.sizeFormRef.inputName.current.getValue()
            sizeModel.system_standard = this.sizeFormRef.systemStandard.current.getValue()
            sizeModel.standard = this.sizeFormRef.standard.current.getValue()
            
            this.state.productTypes.forEach(element => {
                if (element.form_type === FormType.FORM_1 && !sizeModel.product_type) {
                    sizeModel.product_type = element._id;
                }
            })
            sizeModel.form_type = FormType.FORM_1;
            
            this.sizeApiService.save(sizeModel)
                .then(response => {
                    if (response.status === HttpRequestStatusCode.CREATED) {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS),
                            content: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS_CONTENT)
                        })
                        this.props.appUrlContext.redirectTo(RouteConstant.SIZE + '/' + (response.data.data as ISizeModel)._id)
                    } else {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_FAILED),
                            content: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_FAILED_CONTENT)
                        })
                    }
                })
                .catch(error => {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.SERVER_ERROR),
                        content: this.props.languageContext.current.getMessageString(MessageId.SERVER_ERROR_CONTENT)
                    })
                })
        }
    }

    systemStandardSelectBoxHasChanged(id: string) {
        this.standardApiService.all({
            system_standard: {
                $in: [id]
            }
        })
        .then(response => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.setState({
                    standards: response.data.data as IStandardModel[]
                })
            }
        })
    }

    render() {
        return <FrameworkComponents.BasePage {...{
            title: this.props.languageContext.current.getMessageString(MessageId.SIZE_CREATE)
        }}>
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        required={true}
                        ref={this.sizeFormRef.systemStandard}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.SYSTEM_STANDARD)}
                        options={AppRenderUtils.renderSystemStandard(this.state.systemStandards)}
                        onChanged={this.systemStandardSelectBoxHasChanged}
                        disable={!this.state.systemStandards.length} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        required={true}
                        ref={this.sizeFormRef.standard}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.STANDARD)}
                        options={AppRenderUtils.renderStandard(this.state.standards)}
                        disable={!this.state.standards.length}
                    />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        ref={this.sizeFormRef.inputName}
                        validate={[new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)]}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.NAME)} />
                </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>

            <Form1
                ref={this.sizeFormRef.form}
                isCalculatorModel={false}
                languageContext={this.props.languageContext} />
            
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.FLAT}
                        onClick={this.onCancel}>
                        {this.props.languageContext.current.getMessageString(MessageId.CANCEL)}
                    </FrameworkComponents.Button>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.PRIMARY}
                        onClick={this.onRegistration}
                        dialogModel={{
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_REGISTRATION),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_REGISTRATION_CONTENT)
                        }}>
                        {this.props.languageContext.current.getMessageString(MessageId.REGISTRATION)}
                    </FrameworkComponents.Button>
                </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>
        </FrameworkComponents.BasePage>
    }
}

export default WithFramework.withLanguage(
    WithFramework.withAppDialog(
        WithFramework.withAppUrl(SizeCreate)
    )
)