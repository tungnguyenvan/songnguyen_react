import RuleConstant from "framework/constants/RuleConstant";
import Rule from "framework/documents/models/Rule";
import FrameworkUtils from "./FrameworkUtils";

class BaseValidation {
    constructor() {
        this.validate = this.validate.bind(this);
        this.validateRequire = this.validateRequire.bind(this);
        this.validateRegexp = this.validateRegexp.bind(this);
        this.validateMin = this.validateMin.bind(this);
        this.validateMax = this.validateMax.bind(this);
    }

    validateRequire(rule: Rule, value: any): boolean {
        return !FrameworkUtils.isBlank(value);
    }

    validateMax(rule: Rule, value: any): boolean {
        return value.length <= (rule.getRuleValue() as number);
    }

    validateMin(rule: Rule, value: any): boolean {
        return value.length >= (rule.getRuleValue() as number);
    }

    validateRegexp(rule: Rule, value: any) {
        return new RegExp(rule.getRuleValue() as RegExp).test(value);
    }

    validate(rule: Rule, value: any): boolean {
        switch (rule.getRuleConstant()) {
            case RuleConstant.REQUIRED:
                return this.validateRequire(rule, value);
            case RuleConstant.REGEXP:
                return this.validateRegexp(rule, value);
            case RuleConstant.MIN:
                return this.validateMin(rule, value);
            case RuleConstant.MAX:
                return this.validateMax(rule, value);
            default:
                return false;
        }
    }
}

export default BaseValidation;
