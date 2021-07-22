import { FormType } from "framework/constants/AppEnumConstant";

class AppUtils {
    public static formTitle(formType: FormType): string {
        switch (formType) {
            case FormType.FORM_1: {
                return "Form 1";
            }
            case FormType.FORM_2: {
                return "Form 2";
            }
            case FormType.FORM_3: {
                return "Form 3";
            }
            default: {
                return "";
            }
        }
    }
}

export default AppUtils;
