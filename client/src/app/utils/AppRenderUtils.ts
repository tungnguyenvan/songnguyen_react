import ISystemStandardModel from "app/documents/ISystemStandardModel";
import IMultipleOptionModel from "framework/documents/ui/IMultipleOptionItemModel";

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
}

export default AppRenderUtils;
