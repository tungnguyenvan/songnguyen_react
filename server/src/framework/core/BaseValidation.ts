import Express from "express";
import Logging from "@app/framework/utils/Logging";
import IbaseValidateDocument from "@app/framework/interfaces/IbaseValidateDocument";
import Rule from "./Rule";
import RuleConstant from "@app/framework/constants/RuleConstant";
import AppResponse from "@app/framework/system/AppResponse";
import MessageId from "@app/framework/constants/MessageId";
import AppUtil from "../utils/AppUtil";
import RequestFieldConstant from "@app/framework/constants/RequestFieldConstant";

const NAME_SPACE = "BaseValidation";

class BaseValidation {
	private appResponse: AppResponse;
	private field: RequestFieldConstant;
	private validateDocument: IbaseValidateDocument;

	constructor(validateDocument: IbaseValidateDocument, field: RequestFieldConstant) {
		this.validateDocument = validateDocument;
		this.field = field;
		this.appResponse = new AppResponse();

		// binding
		this.validate = this.validate.bind(this);
		this.catchError = this.catchError.bind(this);
		this.validateMax = this.validateMax.bind(this);
		this.validateRegexp = this.validateRegexp.bind(this);
		this.validateRequired = this.validateRequired.bind(this);
	}

	validateRequired(
		request: Express.Request,
		response: Express.Response,
		rule: Rule,
		validateObject: any
	): boolean {
		try {
			let isValid: boolean = true;

			if (!validateObject[rule.getField()]) {
				Logging.debug(NAME_SPACE, `${NAME_SPACE}#validateRequired False`);
				isValid = false;
				this.catchError(request, response, rule);
			}

			return isValid;
		} catch (error) {
			Logging.error(NAME_SPACE, `${NAME_SPACE}#validateMax`, error);
			this.catchError(request, response, rule);
		}
	}

	validateMax(
		request: Express.Request,
		response: Express.Response,
		rule: Rule,
		validateObject: any
	): boolean {
		try {
			let isValid = true;

			if (validateObject[rule.getField()].length > (rule.getRuleValue() as number)) {
				isValid = false;
				this.catchError(request, response, rule);
			}

			return isValid;
		} catch (error) {
			Logging.error(NAME_SPACE, `${NAME_SPACE}#validateMax`, error);
			this.catchError(request, response, rule);
		}
	}

	validateRegexp(
		request: Express.Request,
		response: Express.Response,
		rule: Rule,
		validateObject: any
	): boolean {
		try {
			let isValid = true;

			if (
				AppUtil.isAlive(validateObject[rule.getField()]) &&
				!(rule.getRuleValue() as RegExp).test(validateObject[rule.getField()])
			) {
				isValid = false;
				this.catchError(request, response, rule);
			}

			return isValid;
		} catch (error) {
			Logging.error(NAME_SPACE, `${NAME_SPACE}#validateMax`, error);
			this.catchError(request, response, rule);
		}
	}

	validate(request: Express.Request, response: Express.Response, next: Express.NextFunction): void {
		const validateObject = (request as any)[this.field];
		Logging.info(NAME_SPACE, "BaseValidation#validate", validateObject);

		if (!validateObject) {
			this.appResponse.badRequest(request, response, {
				messageId: MessageId.VALIDATE_FAILED,
				message: `${this.field} not found!`,
				field: this.field,
			});
		}

		for (const item of this.validateDocument.rules) {
			Logging.debug(NAME_SPACE, `${NAME_SPACE}#validate#forEach`);
			switch (item.getRuleConstant()) {
				case RuleConstant.REQUIRED:
					if (!this.validateRequired(request, response, item, validateObject)) return;
					break;
				case RuleConstant.MAX:
					if (!this.validateMax(request, response, item, validateObject)) return;
					break;
				case RuleConstant.REGEXP:
					if (!this.validateRegexp(request, response, item, validateObject)) return;
					break;
			}
		}

		Logging.debug(NAME_SPACE, `${NAME_SPACE}#validate After foreach`);

		next();
	}

	catchError(request: Express.Request, response: Express.Response, rule: Rule): Express.Response {
		return this.appResponse.badRequest(request, response, {
			messageId: MessageId.VALIDATE_FAILED,
			message: rule.getMessageError(),
			field: rule.getField(),
		});
	}
}

export default BaseValidation;
