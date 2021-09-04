import MessageId from "framework/constants/MessageId";
import RuleConstant from "framework/constants/RuleConstant";

class Rule {
    private ruleConstant: RuleConstant;
    private ruleValue: string | number | RegExp | undefined;
    private messageError: MessageId;

    constructor(ruleConstant: RuleConstant, messageError: MessageId, ruleValue?: string | number | RegExp) {
        this.ruleValue = ruleValue;
        this.ruleConstant = ruleConstant;
        this.messageError = messageError;
    }

    getRuleConstant(): RuleConstant {
        return this.ruleConstant;
    }

    getRuleValue(): string | number | RegExp | undefined {
        return this.ruleValue;
    }

    getMessageError(): MessageId {
        return this.messageError;
    }
}

export default Rule;
