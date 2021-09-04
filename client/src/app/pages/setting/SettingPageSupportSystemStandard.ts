import SystemStandardApiService from "app/api/SystemStandardApiService";
import ISystemStandardModel from "app/documents/ISystemStandardModel";
import BaseApiService from "framework/api/BaseApiService";
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode";
import MessageId from "framework/constants/MessageId";
import RouteConstant from "framework/constants/RouteConstant";
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import IAppUrlContext from "framework/contexts/url/IAppUrlContext";
import ITableCellModel from "framework/documents/ui/ITableCellModel";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import ISettingPageSupport from "./ISettingPageSupport";

class SettingPageSupportSystemStandard implements ISettingPageSupport<ISystemStandardModel> {
    appUrlContext: IAppUrlContext;
    appDialogContext: IAppDialogContext;
    languageContext: ILanguageContext;
    callback: (models: ISystemStandardModel[]) => void;
    apiService: BaseApiService<ISystemStandardModel>;

    constructor(appUrlContext: IAppUrlContext, appDialogContext: IAppDialogContext, languageContext: ILanguageContext, callback: (models: ISystemStandardModel[]) => void) {
        this.appUrlContext = appUrlContext;
        this.appDialogContext = appDialogContext;
        this.languageContext = languageContext;
        this.callback = callback;
        this.apiService = new SystemStandardApiService();

        this.all = this.all.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
        this.renderTableContent = this.renderTableContent.bind(this);
    }

    all(): void {
        this.apiService.all().then((response) => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.callback(response.data.data as ISystemStandardModel[]);
            }
        });
    }

    edit(id: string): void {
        this.appUrlContext.redirectTo(RouteConstant.SYSTEM_STANDARD + "/" + id);
    }

    delete(id: string): void {
        this.apiService.delete(id).then((response) => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.appDialogContext.addDialog({
                    title: this.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS),
                    content: this.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS_DETAIL),
                });
                this.all();
            }
        });
    }

    renderHeader(): string[] {
        return [
            this.languageContext.current.getMessageString(MessageId.NAME),
            this.languageContext.current.getMessageString(MessageId.EMPLOYEE),
            this.languageContext.current.getMessageString(MessageId.CREATED_TIME),
            this.languageContext.current.getMessageString(MessageId.ACTION),
        ];
    }
    renderTableContent(models: ISystemStandardModel[]): ITableCellModel[] {
        const tableCells: ITableCellModel[] = [];

        models.forEach((element) => {
            tableCells.push({
                id: element._id,
                content: [element.name, FrameworkUtils.userName(element.createdBy), FrameworkUtils.generateDate(element.createdAt)],
                action: {
                    edit: {
                        isAlive: true,
                        func: this.edit,
                    },
                    delete: {
                        isAlive: true,
                        func: this.delete,
                        dialog: {
                            title: this.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE),
                            content: this.languageContext.current.getMessageString(MessageId.CONFIRM_DELETE_DETAIL),
                        },
                    },
                },
            });
        });

        return tableCells;
    }
}

export default SettingPageSupportSystemStandard;
