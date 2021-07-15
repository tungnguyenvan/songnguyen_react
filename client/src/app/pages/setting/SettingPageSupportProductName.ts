import ProductNameApiService from "app/api/ProductNameApiService";
import IProductNameModel from "app/documents/IProductNameModel";
import BaseApiService from "framework/api/BaseApiService";
import HttpRequestStatusCode from "framework/constants/HttpRequestStatusCode";
import MessageId from "framework/constants/MessageId";
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import IAppUrlContext from "framework/contexts/url/IAppUrlContext";
import ITableCellModel from "framework/documents/ui/ITableCellModel";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import ISettingPageSupport from "./ISettingPageSupport";

class SettingPageSupportProductName implements ISettingPageSupport<IProductNameModel> {
    appUrlContext: IAppUrlContext;
    appDialogContext: IAppDialogContext;
    languageContext: ILanguageContext;
    callback: (models: IProductNameModel[]) => void;
    apiService: BaseApiService<IProductNameModel>;

    constructor(appUrlContext: IAppUrlContext, appDialogContext: IAppDialogContext, languageContext: ILanguageContext, callback: (models: IProductNameModel[]) => void) {
        this.appUrlContext = appUrlContext;
        this.appDialogContext = appDialogContext;
        this.languageContext = languageContext;
        this.callback = callback;
        this.apiService = new ProductNameApiService();

        this.all = this.all.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderTableContent = this.renderTableContent.bind(this);
    }

    all(): void {
        this.apiService.all().then((response) => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.callback(response.data.data as IProductNameModel[]);
            }
        });
    }

    edit(id: string): void {}

    delete(id: string): void {
        this.apiService.delete(id).then((response) => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.all();
                this.appDialogContext.addDialog({
                    title: this.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS),
                    content: this.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS_DETAIL),
                });
            }
        });
    }

    renderTableContent(models: IProductNameModel[]): ITableCellModel[] {
        const tableCells: ITableCellModel[] = [];

        models.forEach((element) => {
            tableCells.push({
                id: element._id,
                content: [
                    element.name,
                    FrameworkUtils.generateProductType(element.product_type),
                    FrameworkUtils.userName(element.createdBy),
                    FrameworkUtils.generateDate(element.createdAt),
                ],
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

    renderHeader(): string[] {
        return [
            this.languageContext.current.getMessageString(MessageId.PRODUCT_NAME),
            this.languageContext.current.getMessageString(MessageId.PRODUCT_TYPE),
            this.languageContext.current.getMessageString(MessageId.EMPLOYEE),
            this.languageContext.current.getMessageString(MessageId.CREATED_TIME),
            this.languageContext.current.getMessageString(MessageId.ACTION),
        ];
    }
}

export default SettingPageSupportProductName;
