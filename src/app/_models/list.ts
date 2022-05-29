import { Field } from '../_decorators/field';
import { BaseImmutable } from './base-immutable';
import { ListItem } from './list-item';

export class List extends BaseImmutable<List> {
    @Field() id?: string;
    @Field() uids?: string[];
    @Field() name?: string;
    @Field({ typeDef: ListItem }) items?: readonly ListItem[];
    @Field() userIds?: string[];
    @Field() ownerId: string;
    @Field() viewType: string;
    @Field() updateToken: string;

    private _itemsByCategory: { [key: string]: ListItem[] };
    get itemsByCategory() {
        return this._itemsByCategory;
    }

    get unmarkedItems() {
        return this.items?.filter(i => !i.marked);
    }

    get markedItems() {
        return this.items?.filter(i => i.marked);
    }

    get categories() {
        return this.items?.reduce((acc, curr, idx) => {
            if (acc.indexOf(curr.category) === -1)
                acc.push(curr.category);

            return acc;
        }, [] as string[]);
    }

    override beforeFreeze(): void {
        this._itemsByCategory = this.items?.reduce((acc, curr, idx) => {
            if (Object.keys(acc).indexOf(curr.category) === -1) {
                acc[curr.category] = [];
            }

            acc[curr.category].push(curr.clone());
            return acc;
        }, {} as { [key: string]: ListItem[] });
    }

}
