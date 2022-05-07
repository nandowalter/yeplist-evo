import { Field } from '../_decorators/field';
import { BaseImmutable } from './base-immutable';
import { ListItem } from './list-item';

export class List extends BaseImmutable<List> {
    @Field() id?: string;
    @Field() uids?: string[];
    @Field() name?: string;
    @Field({ typeDef: ListItem }) items?: readonly ListItem[];
    @Field() itemsCount?: number;
    @Field() userIds?: string[];
    @Field() orderBy: string;

    get unmarkedItems() {
        return this.items?.filter(i => !i.marked);
    }

    get markedItems() {
        return this.items?.filter(i => i.marked);
    }
}
