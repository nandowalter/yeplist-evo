import { Field } from '../_decorators/field';
import { BaseImmutable } from './base-immutable';

export class ListItem extends BaseImmutable<ListItem> {
    @Field() id?: string;
    @Field() name?: string;
    @Field() category?: string;
    @Field() qty?: number;
    @Field() um?: string;
    @Field() notes?: string;
    @Field() marked?: boolean;
    @Field() imageUrls: string[];
    @Field() newImages: string[];
}