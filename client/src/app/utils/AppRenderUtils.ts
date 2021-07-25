import IProductNameModel from "app/documents/IProductNameModel";
import IProductTypeModel from "app/documents/IProductTypeModel";
import ISizeModel from "app/documents/ISizeModel";
import IStandardModel from "app/documents/IStandardModel";
import ISystemStandardModel from "app/documents/ISystemStandardModel";
import IThicknessModel from "app/documents/IThicknessModel";
import { DiscountType, FormType } from "framework/constants/AppEnumConstant";
import MessageId from "framework/constants/MessageId";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import IMultipleOptionModel from "framework/documents/ui/IMultipleOptionItemModel";
import ISelectOptionModel from "framework/documents/ui/ISelectOptionModel";
import AppUtils from "./AppUtils";

class AppRenderUtils {
    public static renderSystemStandard(systemStandards: ISystemStandardModel[]): IMultipleOptionModel[] {
        const multipleOptions: IMultipleOptionModel[] = [];
        systemStandards.forEach((element) => {
            multipleOptions.push({
                id: element._id,
                title: element.name,
            });
        });
        return multipleOptions;
    }

    public static renderFormType(): ISelectOptionModel[] {
        const optios: ISelectOptionModel[] = [];

        optios.push({
            id: FormType.FORM_1,
            title: AppUtils.formTitle(FormType.FORM_1),
        });
        optios.push({
            id: FormType.FORM_2,
            title: AppUtils.formTitle(FormType.FORM_2),
        });
        optios.push({
            id: FormType.FORM_3,
            title: AppUtils.formTitle(FormType.FORM_3),
        });
        return optios;
    }

    public static renderProductTypeSelectBox(models: IProductTypeModel[]): ISelectOptionModel[] {
        const options: ISelectOptionModel[] = [];
        models.forEach((element) => {
            options.push({
                id: element._id,
                title: element.name,
            });
        });
        return options;
    }

    public static renderProductNameSelectBox(models: IProductNameModel[]): ISelectOptionModel[] {
        const options: ISelectOptionModel[] = [];
        models.forEach((element) => {
            options.push({
                id: element._id,
                title: element.name,
            });
        });
        return options;
    }

    public static renderThicknessSelectBox(models: IThicknessModel[]): ISelectOptionModel[] {
        const options: ISelectOptionModel[] = [];
        models.forEach((element) => {
            options.push({
                id: element._id,
                title: element.name,
            });
        });
        return options;
    }

    public static renderStandard(models: IStandardModel[]): ISelectOptionModel[] {
        const options: ISelectOptionModel[] = [];
        models.forEach((element) => {
            options.push({
                id: element._id,
                title: element.name,
            });
        });
        return options;
    }

    public static renderSizeSelectBox(models: ISizeModel[]): ISelectOptionModel[] {
        const options: ISelectOptionModel[] = [];
        models.forEach((element) => {
            options.push({
                id: element._id,
                title: element.name,
            });
        });
        return options;
    }

    public static renderDiscountType(languageContext: ILanguageContext): ISelectOptionModel[] {
        const options: ISelectOptionModel[] = [];
        options.push({
            id: DiscountType.DISCOUNT.toString(),
            title: languageContext.current.getMessageString(MessageId.DISCOUNT),
        });
        options.push({
            id: DiscountType.INCREASE.toString(),
            title: languageContext.current.getMessageString(MessageId.INCREASE),
        });
        return options;
    }
}

export default AppRenderUtils;
