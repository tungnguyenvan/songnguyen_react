import LanguageConstant from "./LanguageConstant";
import MessageId from "./MessageId";
import EngLang from "framework/resources/json/en_lang.json";
import ViLang from "framework/resources/json/vi_lang.json";

const messageStrings = {
	[LanguageConstant.EN]: EngLang,
	[LanguageConstant.VI]: ViLang,
};

class AppMessage {
	public static getMessageString(lang: LanguageConstant, messageId: MessageId): string {
		return messageStrings[lang][messageId];
	}
}

export default AppMessage;
