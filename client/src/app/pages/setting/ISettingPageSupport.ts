import BaseApiService from "framework/api/BaseApiService";
import IAppDialogContext from "framework/contexts/dialog/IAppDialogContext";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import IAppUrlContext from "framework/contexts/url/IAppUrlContext";
import IBaseModel from "framework/documents/models/IBaseModel";
import ITableCellModel from "framework/documents/ui/ITableCellModel";

interface ISettingPageSupport<T extends IBaseModel> {
    appUrlContext: IAppUrlContext;
    appDialogContext: IAppDialogContext;
    languageContext: ILanguageContext;
    callback: (models: T[]) => void;
    apiService: BaseApiService<T>;

    all(): void;
    edit(id: string): void;
    delete(id: string): void;
    renderHeader(): string[];
    renderTableContent(models: T[]): ITableCellModel[];
}

export default ISettingPageSupport;
