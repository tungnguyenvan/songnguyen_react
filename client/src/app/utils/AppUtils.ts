import { CartItemSource, FormType } from "framework/constants/AppEnumConstant";
import MessageId from "framework/constants/MessageId";
import ILanguageContext from "framework/contexts/lang/ILanguageContext";

class AppUtils {
    static sourceTitle(languageContext: ILanguageContext, source: CartItemSource): string {
        if (source === CartItemSource.WAREHOUSE) {
            return languageContext.current.getMessageString(MessageId.WAREHOUSE);
        }

        return languageContext.current.getMessageString(MessageId.DIY);
    }

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
