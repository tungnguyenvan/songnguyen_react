import ISizeModel from "app/documents/ISizeModel";
import { CartItemSource, FormType, GasketPTCShape } from "framework/constants/AppEnumConstant";
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

    public static compare2Size(firstSize: ISizeModel, secondSize: ISizeModel) {
        if (firstSize.form_type === secondSize.form_type) {
            if (firstSize.form_type === FormType.FORM_2) {
                if (firstSize.shape_type === secondSize.shape_type) {
                    switch (firstSize.shape_type) {
                        case GasketPTCShape.RF_CIRCLE: {
                            return firstSize.inner_diameter === secondSize.inner_diameter && firstSize.outer_diameter === secondSize.outer_diameter;
                        }
                        case GasketPTCShape.FF_CIRCLE: {
                            return (
                                firstSize.inner_diameter === secondSize.inner_diameter &&
                                firstSize.outer_diameter === secondSize.outer_diameter &&
                                firstSize.hole_count === secondSize.hole_count &&
                                firstSize.hole_diameter === secondSize.hole_diameter
                            );
                        }
                        case GasketPTCShape.RF_RECTANGLE: {
                            return firstSize.wn === secondSize.wn && firstSize.wt && secondSize.wt && firstSize.ln === secondSize.ln && firstSize.lt === secondSize.lt;
                        }
                        case GasketPTCShape.FF_RECTANGLE: {
                            return (
                                firstSize.wn === secondSize.wn &&
                                firstSize.wt &&
                                secondSize.wt &&
                                firstSize.ln === secondSize.ln &&
                                firstSize.lt === secondSize.lt &&
                                firstSize.hole_count === secondSize.hole_count &&
                                firstSize.hole_diameter === secondSize.hole_diameter
                            );
                        }
                        case GasketPTCShape.FF_MANHOLE: {
                            return (
                                firstSize.wn === secondSize.wn &&
                                firstSize.ln === secondSize.ln &&
                                firstSize.ir === secondSize.ir &&
                                firstSize.or === secondSize.or &&
                                firstSize.hole_count === secondSize.hole_count &&
                                firstSize.hole_diameter === secondSize.hole_diameter
                            );
                        }
                    }
                } else {
                    return false;
                }
            } else if (firstSize.form_type === FormType.FORM_3) {
                return firstSize.wt === secondSize.wt && firstSize.lt === secondSize.lt;
            }
        }
        return false;
    }
}

export default AppUtils;
