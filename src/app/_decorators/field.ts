import { BaseImmutable } from "../_models/base-immutable";
import { IFieldDefinition } from "../_models/field-definition.interface";

export const Field = (def?: IFieldDefinition) => {
    return (target: BaseImmutable<any>, memberName: string) => {
        if (target.fieldDefs)
            target.fieldDefs[memberName] = def ? { ...def } : { };
    };
}