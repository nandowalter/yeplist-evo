import { Field } from "../_decorators/field";
import { BaseImmutable } from "./base-immutable";

export class ShareTokenData extends BaseImmutable<ShareTokenData> {
    @Field() listId?: string;
    @Field() shareToken?: string;
    @Field() updateToken?: string;
}