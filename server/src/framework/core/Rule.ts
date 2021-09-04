import RuleConstant from "@app/framework/constants/RuleConstant";

class Rule {
    private field: string;
    private ruleConstant: RuleConstant;
    private ruleValue: string | number | RegExp | undefined;
    private messageError: string;

    constructor(field: string, ruleConstant: RuleConstant, messageError: string, ruleValue?: string | number | RegExp) {
        this.field = field;
        this.ruleValue = ruleValue;
        this.ruleConstant = ruleConstant;
        this.messageError = messageError;
    }

    getField(): string {
        return this.field;
    }

    getRuleConstant(): RuleConstant {
        return this.ruleConstant;
    }

    getRuleValue(): string | number | RegExp | undefined {
        return this.ruleValue;
    }

    getMessageError(): string {
        return this.messageError;
    }
}

export default Rule;
