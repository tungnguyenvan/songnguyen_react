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

interface StandardDetailProps {
    languageContext: ILanguageContext
    appDialogContext: IAppDialogContext
    appUrlContext: IAppUrlContext
}

interface StandardDetailState {
    systemStandards: ISystemStandardModel[]
    standard: IStandardModel
}

interface IParams {
    id: string
}

class StandardDetail extends React.Component<StandardDetailProps, StandardDetailState> {
    private systemStandardApiService: SystemStandardApiService;
    private standardApiService: StandardApiService;
    private standardFormRef: IStandardFormRef;
    private standardFormValidate: IStandardFormValidate;

    constructor(props: StandardDetailProps) {
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
            systemStandards: [],
            standard: {} as IStandardModel
        }

        this.onDelete = this.onDelete.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
    }

    componentDidMount() {
        const path = FrameworkUtils.matchPath(window.location.pathname, RouteConstant.STANDARD_DETAIL)
        if (path) {
            this.requestApi((path.params as IParams).id)
        }

        this.systemStandardApiService.all()
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        systemStandards: response.data.data as ISystemStandardModel[]
                    })
                }
            })
    }

    requestApi(id: string) {
        this.standardApiService.get(id)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.setState({
                        standard: response.data.data as IStandardModel
                    })
                }
            })
    }

    onDelete() {
        this.standardApiService.delete(this.state.standard._id)
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
        if (!FrameworkUtils.formHasChanged(this.standardFormRef)) {
            this.props.appDialogContext.addDialog({
                title: this.props.languageContext.current.getMessageString(MessageId.FORM_NOT_CHANGE),
                content: this.props.languageContext.current.getMessageString(MessageId.FORM_NOT_CHANGE_DETAIL)
            })
        }

        if (FrameworkUtils.validateFrom(this.standardFormRef) && FrameworkUtils.formHasChanged(this.standardFormRef)) {
            const standard: IStandardModel = {
                name: this.standardFormRef.inputName.current.getValue(),
                system_standard: this.standardFormRef.selectBoxSystemStandard.current.getValue(),
                coefficient: this.standardFormRef.inputCoefficient.current.getValue(),
                bolt: this.standardFormRef.inputBolt.current.getValue()
            } as IStandardModel

            this.standardApiService.update(this.state.standard._id, standard)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.props.appDialogContext.addDialog({
                        title: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS),
                        content: this.props.languageContext.current.getMessageString(MessageId.UPDATE_SUCCESS_DETAIL)
                    })

                    this.requestApi(this.state.standard._id)
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
            title: this.props.languageContext.current.getMessageString(MessageId.STANDARD_DETAIL)
        }}>
            <FrameworkComponents.BaseForm>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.NAME)}
                        ref={this.standardFormRef.inputName}
                        validate={this.standardFormValidate.inputName}
                        value={this.state.standard.name}
                    />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.SelectBox
                        required={true}
                        ref={this.standardFormRef.selectBoxSystemStandard}
                        options={AppRenderUtils.renderSystemStandard(this.state.systemStandards)}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.SYSTEM_STANDARD)}
                        errorMessage={this.props.languageContext.current.getMessageString(MessageId.VALIDATE_REQUIRE)}
                        selectedId={this.state.standard.system_standard ? (this.state.standard.system_standard as ISystemStandardModel)._id : ""} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.COEFFICIENT)}
                        ref={this.standardFormRef.inputCoefficient}
                        validate={this.standardFormValidate.inputCoefficient}
                        value={this.state.standard.coefficient} />
                    <FrameworkComponents.InputText
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.BOLT)}
                        ref={this.standardFormRef.inputBolt}
                        validate={this.standardFormValidate.inputBolt}
                        value={this.state.standard.bolt} />
                </FrameworkComponents.FormGroup>
                <FrameworkComponents.FormGroup>
                    <FrameworkComponents.InputText
                        readOnly={true}
                        placeHolder={this.props.languageContext.current.getMessageString(MessageId.EMPLOYEE)}
                        value={FrameworkUtils.userName(this.state.standard.createdBy)} />
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
        WithFramework.withAppUrl(StandardDetail)
    )
)