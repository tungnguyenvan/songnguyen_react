import LanguageConstant from "framework/constants/LanguageConstant";
import ILanguageContextFunc from "./ILanguageContextFunc";

interface ILanguageContext {
    currentLanguage: LanguageConstant;
    current: ILanguageContextFunc;
}

export default ILanguageContext;
