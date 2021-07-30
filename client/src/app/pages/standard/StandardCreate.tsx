import StandardApiService from "app/api/StandardApiService"
import SystemStandardApiService from "app/api/SystemStandardApiService"
import IStandardModel from "app/documents/IStandardModel"
import ISystemStandardModel from "app/documents/ISystemStandardModel"
import AppRenderUtils from "app/utils/AppRenderUtils"
import FrameworkComponents from "framework/components/FrameworkComponents"
import IFormInputElement from "framework/components/IFormInputElement"
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
import FrameworkUtils from "framework/utils/FrameworkUtils"
import React from "react"
import { IStandardFormRef, IStandardFormValidate } from "./StandardFormDefinition"

interface StandardCreateProps {
    languageContext: ILanguageContext
    appDialogContext: IAppDialogContext
    appUrlContext: IAppUrlContext
}

interface StandardCreateState {
    systemStandards: ISystemStandardModel[]
}

class StandardCreate extends React.Component<StandardCreateProps, StandardCreateState> {
    private systemStandardApiService: SystemStandardApiService;
    private standardApiService: StandardApiService;
    private standardFormRef: IStandardFormRef;
    private standardFormValidate: IStandardFormValidate;

    constructor(props: StandardCreateProps) {
        super(props)

        this.systemStandardApiService = new SystemStandardApiService();
        this.standardApiService = new StandardApiService();
        this.standardFormRef = {
            inputName: React.createRef<IFormInputElement>(),
            selectBoxSystemStandard: React.createRef<IFormInputElement>(),
            inputCoefficient: React.createRef<IFormInputElement>(),
            inputBolt: React.createRef<IFormInputElement>()
        }
        this.standardFormValidate = {
            inputName: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)],
            selectBoxSystemStandard: [],
            inputCoefficient: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE), 
                new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_FLOAT, new RegExp(AppConstant.DOUBLE_NUMBER_REGEXP))],
            inputBolt: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE),
                new Rule(RuleConstant.REGEXP, MessageId.VALIDATE_ONLY_FLOAT, new RegExp(AppConstant.DOUBLE_NUMBER_REGEXP))]
        }

        this.state = {
            systemStandards: []
        }

        this.onCancel = this.onCancel.bind(this)
        this.onRegistration = this.onRegistration.bind(this)
    }

    componentDidMount() {
        this.systemStandardApiService.all()
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        systemStandards: response.data.data as ISystemStandardModel[]
                    })
                }
            })
    }

    onCancel() {
        FrameworkUtils.formClear(this.standardFormRef)
    }

    onRegistration() {
        if (FrameworkUtils.validateFrom(this.standardFormRef)) {
            const standard: IStandardModel = {
                name: this.standardFormRef.inputName.current.getValue(),
                system_standard: this.standardFormRef.selectBoxSystemStandard.current.getValue(),
                coefficient: this.standardFormRef.inputCoefficient.current.getValue(),
                bolt: this.standardFormRef.inputBolt.current.getValue()
            } as IStandardModel

            this.standardApiService.save(standard)
                .then(response => {
                    if (response.status === HttpRequestStatusCode.CREATED) {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS),
                            content: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS_CONTENT)
                        })
                        this.props.appUrlContext.redirectTo(RouteConstant.STANDARD + '/' + (response.data.data as IStandardModel)._id)
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

    render() {
        return <FrameworkComponents.BasePage {...{
            title: this.props.languageContext.current.getMessageString(MessageId.STANDARD_CREATE)
        }}>
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.NAME)}
                        ref={this.standardFormRef.inputName}
                        validate={this.standardFormValidate.inputName}
                    />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        required={true}
                        ref={this.standardFormRef.selectBoxSystemStandard}
                        options={AppRenderUtils.renderSystemStandard(this.state.systemStandards)}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.SYSTEM_STANDARD)}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.COEFFICIENT)}
                        ref={this.standardFormRef.inputCoefficient}
                        validate={this.standardFormValidate.inputCoefficient} />
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.BOLT)}
                        ref={this.standardFormRef.inputBolt}
                        validate={this.standardFormValidate.inputBolt} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.FLAT}
                        onClick={this.onCancel}>
                        {this.props.languageContext.current.getMessageString(MessageId.CANCEL)}
                    </FrameworkComponents.Button>
                    <FrameworkComponents.Button
                        type={ButtonTypeConstant.PRIMARY}
                        dialogModel={{
                            title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_REGISTRATION),
                            content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_REGISTRATION_CONTENT)
                        }}
                        onClick={this.onRegistration}>
                        {this.props.languageContext.current.getMessageString(MessageId.REGISTRATION)}
                    </FrameworkComponents.Button>
                </FrameworkComponents.FormGroup>
            </FrameworkComponents.BaseForm>
        </FrameworkComponents.BasePage>
    }
}

export default WithFramework.withLanguage(
    WithFramework.withAppDialog(
        WithFramework.withAppUrl(StandardCreate)
    )
)