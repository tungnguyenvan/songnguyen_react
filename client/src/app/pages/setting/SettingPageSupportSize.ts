import SizeApiService from "app/api/SizeApiService";
import IProductTypeModel from "app/documents/IProductTypeModel";
import ISizeModel from "app/documents/ISizeModel";
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

class SettingPageSupportSize implements ISettingPageSupport<ISizeModel> {
    appUrlContext: IAppUrlContext;
    appDialogContext: IAppDialogContext;
    languageContext: ILanguageContext;
    callback: (models: ISizeModel[]) => void;
    apiService: BaseApiService<ISizeModel>;

    constructor(appUrlContext: IAppUrlContext, appDialogContext: IAppDialogContext, languageContext: ILanguageContext, callback: (models: ISizeModel[]) => void) {
        this.appUrlContext = appUrlContext;
        this.appDialogContext = appDialogContext;
        this.languageContext = languageContext;
        this.callback = callback;
        this.apiService = new SizeApiService();

        this.all = this.all.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
        this.renderTableContent = this.renderTableContent.bind(this);
    }

    all(): void {
        this.apiService.all().then((response) => {
            if (response.status === HttpRequestStatusCode.OK) {
                this.callback(response.data.data as ISizeModel[]);
            }
        });
    }

    edit(id: string): void {
        this.appUrlContext.redirectTo(RouteConstant.SIZE + "/" + id);
    }

    delete(id: string): void {
        this.apiService
            .delete(id)
            .then((response) => {
                if (response.status === HttpRequestStatusCode.OK) {
                    this.all();
                    this.appDialogContext.addDialog({
                        title: this.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS),
                        content: this.languageContext.current.getMessageString(MessageId.DELETE_SUCCESS_DETAIL),
                    });
                } else {
                    this.appDialogContext.addDialog({
                        title: this.languageContext.current.getMessageString(MessageId.CANNOT_DELETE),
                        content: this.languageContext.current.getMessageString(MessageId.CANNOT_DELETE_DETAIL),
                    });
                }
            })
            .catch((error) => {
                this.appDialogContext.addDialog({
                    title: this.languageContext.current.getMessageString(MessageId.CANNOT_DELETE),
                    content: this.languageContext.current.getMessageString(MessageId.CANNOT_DELETE_DETAIL),
                });
            });
    }

    renderHeader(): string[] {
        return [
            this.languageContext.current.getMessageString(MessageId.NAME),
            this.languageContext.current.getMessageString(MessageId.PRODUCT_TYPE),
            this.languageContext.current.getMessageString(MessageId.INNER_DIAMETER),
            this.languageContext.current.getMessageString(MessageId.OUTER_DIAMETER),
            this.languageContext.current.getMessageString(MessageId.HOLE_COUNT),
            this.languageContext.current.getMessageString(MessageId.HOLE_DIAMETER),
            this.languageContext.current.getMessageString(MessageId.MATERIAL_PRICE),
            this.languageContext.current.getMessageString(MessageId.WORK_PRICE),
            this.languageContext.current.getMessageString(MessageId.EMPLOYEE),
            this.languageContext.current.getMessageString(MessageId.CREATED_TIME),
            this.languageContext.current.getMessageString(MessageId.ACTION),
        ];
    }

    renderTableContent(models: ISizeModel[]): ITableCellModel[] {
        const tableCells: ITableCellModel[] = [];
        models.forEach((element) => {
            tableCells.push({
                id: element._id,
                content: [
                    element.name,
                    (element.product_type as IProductTypeModel).name,
                    element.inner_diameter.toString(),
                    element.outer_diameter.toString(),
                    element.hole_count.toString(),
                    element.hole_diameter.toString(),
                    element.material_price.toString(),
                    element.work_price.toString(),
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
}

export default SettingPageSupportSize;
