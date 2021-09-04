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

interface SystemStandardDetailProps {
    languageContext: ILanguageContext
    appDialogContext: IAppDialogContext
    appUrlContext: IAppUrlContext
}

interface SystemStandardDetailState {
    systemStandard: ISystemStandardModel
}

interface Params {
    id: string
}

class SystemStandardDetail extends React.Component<SystemStandardDetailProps, SystemStandardDetailState> {
    private systemStandardApiService: SystemStandardApiService
    private systemStandardFormRef: SystemStandardFormRef
    private systemStandardFormValidate: SystemStandardFormValidate

    constructor(props: SystemStandardDetailProps) {
        super(props)

        this.systemStandardFormRef = {
            inputName: React.createRef<IFormInputElement>()
        }
        this.systemStandardFormValidate = {
            inputName: [new Rule(RuleConstant.REQUIRED, MessageId.VALIDATE_REQUIRE)]
        }
        this.systemStandardApiService = new SystemStandardApiService()

        this.state = {
            systemStandard: {} as ISystemStandardModel
        }

        this.requestApi = this.requestApi.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
    }

    componentDidMount() {
        const path = FrameworkUtils.matchPath(window.location.pathname, RouteConstant.SYSTEM_STANDARD_DETAIL)

        if (path) {
            this.requestApi((path.params as Params).id)
        }
    }

    requestApi(id: string) {
        this.systemStandardApiService.get(id)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        systemStandard: response.data.data as ISystemStandardModel
                    })
                }
            })
    }

    onDelete() {
        this.systemStandardApiService.delete(this.state.systemStandard._id)
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
        if (!FrameworkUtils.formHasChanged(this.systemStandardFormRef)) {
            this.props.appDialogContext.addDialog({
                title: this.props.languageContext.current.getMessageString(MessageId.FORM_NOT_CHANGE),
                content: this.props.languageContext.current.getMessageString(MessageId.FORM_NOT_CHANGE_DETAIL)
            })
        }

        if (FrameworkUtils.validateFrom(this.systemStandardFormRef) && FrameworkUtils.formHasChanged(this.systemStandardFormRef)) {
            const thicknessModel: ISystemStandardModel = {
                name: this.systemStandardFormRef.inputName.current.getValue()
            } as ISystemStandardModel

            this.systemStandardApiService.update(this.state.systemStandard._id, thicknessModel)
                .then(response => {
                    if (response.status === HttpRequestStatusCode.OK) {
                        this.props.appDialogContext.addDialog({
                            title: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS),
                            content: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS_DETAIL)
                        })

                        this.requestApi(this.state.systemStandard._id)
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
            title: this.props.languageContext.current.getMessageString(MessageId.SYSTEM_STANDARD_DETAIL)
        }}>

            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        value={this.state.systemStandard.name}
                        ref={this.systemStandardFormRef.inputName}
                        validate={this.systemStandardFormValidate.inputName}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.NAME)} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        readOnly={true}
                        value={FrameworkUtils.userName(this.state.systemStandard.createdBy)}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.EMPLOYEE)} />
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
        WithFramework.withAppUrl(SystemStandardDetail)
    )
)