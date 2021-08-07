import Rule from "@app/framework/core/Rule";
import RuleConstant from "@app/framework/constants/RuleConstant";
import IbaseValidateDocument from "@app/framework/interfaces/IbaseValidateDocument";

class WarehouseValidateDocument {
    public static save: IbaseValidateDocument = {
        rules: [],
    } as IbaseValidateDocument;
}

export default WarehouseValidateDocument;
