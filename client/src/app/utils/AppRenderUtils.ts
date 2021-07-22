import ISystemStandardModel from "app/documents/ISystemStandardModel";
import { FormType } from "framework/constants/AppEnumConstant";
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
}

export default AppRenderUtils;
