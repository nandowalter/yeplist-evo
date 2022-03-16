export class List {
    id?: string;
    uids?: string[];
    name?: string;
    items?: any[];
    itemsCount?: number;
    userIds?: string[];

    get unmarkedItems() {
        return this.items?.filter(i => !i.marked);
    }

    get markedItems() {
        return this.items?.filter(i => i.marked);
    }
}