import ICartModel from "app/documents/ICartModel";
import ICustomerModel from "app/documents/ICustomerModel";
import IProductNameModel from "app/documents/IProductNameModel";
import IProductTypeModel from "app/documents/IProductTypeModel";
import ISizeModel from "app/documents/ISizeModel";
import IStandardModel from "app/documents/IStandardModel";
import ISystemStandardModel from "app/documents/ISystemStandardModel";
import IThicknessModel from "app/documents/IThicknessModel";
import { CartItemStatus, CartStatus, DiscountType, FormType, GasketPTCShape } from "framework/constants/AppEnumConstant";
import MessageId from "framework/constants/MessageId";
import { UserRole } from "framework/constants/UserEnumConstant";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";
import IMultipleOptionModel from "framework/documents/ui/IMultipleOptionItemModel";
import ISelectOptionModel from "framework/documents/ui/ISelectOptionModel";
import FrameworkUtils from "framework/utils/FrameworkUtils";
import AppUtils from "./AppUtils";

class AppRenderUtils {
    static renderCartItemStatus(languageContext: ILanguageContext): ISelectOptionModel[] {
        return [
            {
                id: CartItemStatus.DISCUSS,
                title: languageContext.current.getMessageString(MessageId.DISCUSS),
            },
            {
                id: CartItemStatus.CONFIRM,
                title: languageContext.current.getMessageString(MessageId.CONFIRM),
            },
            {
                id: CartItemStatus.DOING,
                title: languageContext.current.getMessageString(MessageId.DOING),
            },
            {
                id: CartItemStatus.DONE,
                title: languageContext.current.getMessageString(MessageId.DONE),
            },
        ];
    }
    static renderUserRoleSelectBox(languageContext: ILanguageContext): ISelectOptionModel[] {
        return [
            {
                id: UserRole.ADMIN,
                title: languageContext.current.getMessageString(MessageId.ADMIN),
            },
            {
                id: UserRole.SELLER,
                title: languageContext.current.getMessageString(MessageId.SELLER),
            },
            {
                id: UserRole.ACCOUNTANT,
                title: languageContext.current.getMessageString(MessageId.ACCOUNTANT),
            },
        ];
    }
    static renderCartStatusSelectBox(languageContext: ILanguageContext): ISelectOptionModel[] {
        const options: ISelectOptionModel[] = [
            {
                id: CartStatus.DISCUSS,
                title: languageContext.current.getMessageString(MessageId.DISCUSS),
            },
            {
                id: CartStatus.CONFIRM,
                title: languageContext.current.getMessageString(MessageId.CONFIRM),
            },
            {
                id: CartStatus.DOING,
                title: languageContext.current.getMessageString(MessageId.DOING),
            },
            {
                id: CartStatus.DONE,
                title: languageContext.current.getMessageString(MessageId.DONE),
            },
        ];
        return options;
    }

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

    public static renderChooseShape(languageContext: ILanguageContext): ISelectOptionModel[] {
        const options: ISelectOptionModel[] = [];
        options.push({
            id: GasketPTCShape.RF_CIRCLE,
            title: languageContext.current.getMessageString(MessageId.RF_CIRCLE),
        });
        options.push({
            id: GasketPTCShape.FF_CIRCLE,
            title: languageContext.current.getMessageString(MessageId.FF_CIRCLE),
        });
        options.push({
            id: GasketPTCShape.RF_RECTANGLE,
            title: languageContext.current.getMessageString(MessageId.RF_RECTANGLE),
        });
        options.push({
            id: GasketPTCShape.FF_RECTANGLE,
            title: languageContext.current.getMessageString(MessageId.FF_RECTANGLE),
        });
        options.push({
            id: GasketPTCShape.FF_MANHOLE,
            title: languageContext.current.getMessageString(MessageId.FF_MANHOLE),
        });
        return options;
    }

    public static renderCartSelectBox(carts: ICartModel[]): ISelectOptionModel[] {
        const options: ISelectOptionModel[] = [];
        carts.forEach((element) => {
            options.push({
                id: element._id,
                title: (element.customer as ICustomerModel).name + " - " + FrameworkUtils.generateDate(element.createdAt),
            });
        });
        return options;
    }

    public static renderCustomerSelectBox(customers: ICustomerModel[]): ISelectOptionModel[] {
        const options: ISelectOptionModel[] = [];
        customers.forEach((element) => {
            options.push({
                id: element._id,
                title: element.name,
            });
        });
        return options;
    }
}

export default AppRenderUtils;
