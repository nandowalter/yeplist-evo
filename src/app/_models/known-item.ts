import { Field } from "../_decorators/field";
import { BaseImmutable } from "./base-immutable";

export class KnownItem extends BaseImmutable<KnownItem> {
    @Field() name?: string;
    @Field() category?: string;
    @Field() um?: string;
}