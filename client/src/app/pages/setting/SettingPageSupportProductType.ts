import ProductTypeApiService from "app/api/ProductTypeApiService";
import IProductTypeModel from "app/documents/IProductTypeModel";
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

class SettingPageSupportProductType implements ISettingPageSupport<IProductTypeModel> {
    appUrlContext: IAppUrlContext;
    appDialogContext: IAppDialogContext;
    languageContext: ILanguageContext;
    callback: (models: IProductTypeModel[]) => void;
    apiService: BaseApiService<IProductTypeModel>;

    constructor(appUrlContext: IAppUrlContext, appDialogContext: IAppDialogContext, languageContext: ILanguageContext, callback: (models: IProductTypeModel[]) => void) {
        this.appUrlContext = appUrlContext;
        this.appDialogContext = appDialogContext;
        this.languageContext = languageContext;
        this.callback = callback;
        this.apiService = new ProductTypeApiService();

        this.all = this.all.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
        this.renderTableContent = this.renderTableContent.bind(this);
    }

    all(): void {
        this.apiService.all().then((response) => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.callback(response.data.data as IProductTypeModel[]);
            }
        });
    }

    edit(id: string): void {
        this.appUrlContext.redirectTo(RouteConstant.PRODUCT_TYPE + "/" + id);
    }

    delete(id: string): void {}

    renderHeader(): string[] {
        return [
            this.languageContext.current.getMessageString(MessageId.PRODUCT_TYPE),
            this.languageContext.current.getMessageString(MessageId.EMPLOYEE),
            this.languageContext.current.getMessageString(MessageId.CREATED_TIME),
            this.languageContext.current.getMessageString(MessageId.ACTION),
        ];
    }

    renderTableContent(models: IProductTypeModel[]): ITableCellModel[] {
        models = models as IProductTypeModel[];

        const tableContents: ITableCellModel[] = [];

        models.forEach((element) => {
            tableContents.push({
                id: element._id,
                content: [
                    // name
                    element.name,

                    // created by
                    FrameworkUtils.userName(element.createdBy),

                    // created at
                    FrameworkUtils.generateDate(element.createdAt),
                ],
                action: {
                    edit: {
                        isAlive: true,
                        func: this.edit,
                    },
                },
            });
        });

        return tableContents;
    }
}

export default SettingPageSupportProductType;
