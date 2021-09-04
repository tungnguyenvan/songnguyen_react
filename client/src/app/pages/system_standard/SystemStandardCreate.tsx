import SystemStandardApiService from "app/api/SystemStandardApiService"
import ISystemStandardModel from "app/documents/ISystemStandardModel"
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
import { SystemStandardFormRef, SystemStandardFormValidate } from "./SystemStandardFormDefinition"

interface SystemStandardCreateProps {
    languageContext: ILanguageContext
    appDialogContext: IAppDialogContext
    appUrlContext: IAppUrlContext
}

class SystemStandardCreate extends React.Component<SystemStandardCreateProps> {
    private systemStandardApiService: SystemStandardApiService
    private systemStandardFormRef: SystemStandardFormRef
    private systemStandardFormValidate: SystemStandardFormValidate

    constructor(props: SystemStandardCreateProps) {
        super(props)

        this.systemStandardFormRef = {
            inputName: React.createRef<IFormInputElement>()
        }
        this.systemStandardFormValidate = {
            inputName: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)]
        }
        this.systemStandardApiService = new SystemStandardApiService()
        
        this.onCancel = this.onCancel.bind(this)
        this.onRegistration = this.onRegistration.bind(this)
    }

    onCancel() {
        FrameworkUtils.formClear(this.systemStandardFormRef)
    }

    onRegistration() {
        if (FrameworkUtils.validateFrom(this.systemStandardFormRef)) {
            const thickness: ISystemStandardModel = {
                name: this.systemStandardFormRef.inputName.current.getValue(),
            } as ISystemStandardModel

            this.systemStandardApiService.save(thickness)
                .then(response => {
                    if (response.status === HttpRequestStatusCode.CREATED) {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS),
                            content: this.props.languageContext.current.getMessageString(MessageId.REGISTRATION_SUCCESS_CONTENT)
                        })
                        this.props.appUrlContext.redirectTo(RouteConstant.SYSTEM_STANDARD + '/' + (response.data.data as ISystemStandardModel)._id)
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
            title: this.props.languageContext.current.getMessageString(MessageId.SYSTEM_STANDARD_CREATE)
        }}>
            <FrameworkComponents.BaseForm>
            <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        ref={this.systemStandardFormRef.inputName}
                        validate={this.systemStandardFormValidate.inputName}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.NAME)} />
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
        WithFramework.withAppUrl(SystemStandardCreate)
    )
)