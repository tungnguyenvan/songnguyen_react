import LanguageConstant from "framework/constants/LanguageConstant";
import MessageId from "framework/constants/MessageId";

interface ILanguageContextFunc {
    changeLanguage(lang: LanguageConstant): void;
	getMessageString(messageId: MessageId): string;
}

export default ILanguageContextFunc