import Rule from "@app/framework/core/Rule";
import Express from "express";
import RuleConstant from "@app/framework/constants/RuleConstant";
import IbaseValidateDocument from "@app/framework/interfaces/IbaseValidateDocument";

class AddressValidateDocument {
    public static save: IbaseValidateDocument = {
        rules: [
            /**
             * Require address
             */
            new Rule("address", RuleConstant.REQUIRED, "address is required"),

            /**
             * Require city
             */
            new Rule("city", RuleConstant.REQUIRED, "city is required"),

            /**
             * Require district
             */
            new Rule("district", RuleConstant.REQUIRED, "district is required"),

            /**
             * Require ward
             */
            new Rule("ward", RuleConstant.REQUIRED, "ward is required"),
        ],
    } as IbaseValidateDocument;

    public static middlewareSave(
        request: Express.Request,
        response: Express.Response,
        next: Express.NextFunction
    ): void {
        // handle this
        next();
    }
}

export default AddressValidateDocument;
