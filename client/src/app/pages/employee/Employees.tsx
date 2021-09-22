import UserApiService from "framework/api/UserApiService";
import FrameworkComponents from "framework/components/FrameworkComponents"
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode";
import MessageId from "framework/constants/MessageId";
import RouteConstant from "framework/constants/RouteConstant";
import { UserRole } from "framework/constants/UserEnumConstant";
import WithFramework from "framework/constants/WithFramework";
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import IAppUrlContext from "framework/contexts/url/IAppUrlContext";
import IUserLoginContext from "framework/contexts/user/IUserLoginContext";
import IUserModel from "framework/documents/models/IUserModel";
import ITableCellModel from "framework/documents/ui/ITableCellModel";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import React from "react"

interface EmployeesProps {
	languageContext: ILanguageContext;
	appUrlContext: IAppUrlContext;
	appDialogContext: IAppDialogContext;
    userLoginContext: IUserLoginContext;
}

interface EmployeesState {
    users: IUserModel[]
}

class Employees extends React.Component<EmployeesProps, EmployeesState> {
    private userApiService: UserApiService

    constructor(props: EmployeesProps) {
        super(props)

        this.userApiService = new UserApiService()
        this.state = {
            users: []
        }

        this.requestApi = this.requestApi.bind(this)
        this.editUser = this.editUser.bind(this)
        this.deleteUser = this.deleteUser.bind(this)
        this.renderUserTable = this.renderUserTable.bind(this)
    }

    componentDidMount() {
        this.requestApi()
    }

    requestApi() {
        this.userApiService.all({
            role: {
                $in: [UserRole.ACCOUNTANT, UserRole.SELLER, UserRole.ADMIN]
            }
        })
        .then(response => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.setState({
                    users: response.data.data as IUserModel[]
                })
            }
        })
    }

    renderUserTable(): ITableCellModel[] {
        const tableCells: ITableCellModel[] = []

        this.state.users.forEach(element => {
            tableCells.push({
                id: element._id,
                content: [
                    element.email,
                    FrameworkUtils.userName(element),
                    element.birthDate,
                    element.phoneNumber,
                    FrameworkUtils.userName(element.createdBy),
                    FrameworkUtils.generateDate(element.createdAt)
                ],
                action: {
                    edit: {
                        isAlive: this.props.userLoginContext.state.user?.role === UserRole.ADMIN,
                        func: this.editUser
                    },
                    delete: {
                        isAlive: this.props.userLoginContext.state.user?.role === UserRole.ADMIN,
                        func: this.deleteUser,
                        dialog: {
							title: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE),
							content: this.props.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE_DETAIL)
						}
                    }
                }
            })
        })

        return tableCells
    }

    editUser(id: string) {
        this.props.appUrlContext.redirectTo(RouteConstant.EMPLOYEE + id)
    }

    deleteUser(id: string) {
        this.userApiService.delete(id)
            .then(response => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.requestApi()
                    this.props.appDialogContext.addDialog({
						title: this.props.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS),
						content: this.props.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS_DETAIL)
					})
                }
            })
    }

    render() {
        return <FrameworkComponents.BasePage {...{
            title: this.props.languageContext.current.getMessageString(MessageId.EMPLOYEE)
        }}>
            <FrameworkComponents.Table {...{
                header: [
                    this.props.languageContext.current.getMessageString(MessageId.EMAIL),
                    this.props.languageContext.current.getMessageString(MessageId.NAME),
                    this.props.languageContext.current.getMessageString(MessageId.BIRTH_DATE),
                    this.props.languageContext.current.getMessageString(MessageId.PHONE_NUMBER),
                    this.props.languageContext.current.getMessageString(MessageId.EMPLOYEE),
                    this.props.languageContext.current.getMessageString(MessageId.CREATED_TIME),
                    this.props.languageContext.current.getMessageString(MessageId.ACTION)
                ],
                content: this.renderUserTable(),
                commonButton: () => {
                    this.props.appUrlContext.redirectTo(RouteConstant.EMPLOYEE_CREATE)
                }
            }} />
        </FrameworkComponents.BasePage>
    }
}

export default  WithFramework.withAppUrl(
	WithFramework.withLanguage(
		WithFramework.withAppDialog(
            WithFramework.withUserLogin(Employees)
        )
	)
);