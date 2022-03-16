import { Injectable, Optional } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, query, QueryConstraint, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { combineLatest, firstValueFrom, map, Observable, of, switchMap } from 'rxjs';
import { List } from '../_models/list';

@Injectable({providedIn: 'root'})
export class MainDataService {
    private data$: Observable<List[]>;
    
    constructor(
        private firestore: Firestore,
        @Optional() private auth: Auth
    ) {
        this.data$ = collectionData(this.getYListsQuery(), { idField: 'id' }).pipe(
            map(values => values.map(v => this.mapObjectToList(v))),
            switchMap((items: List[]) => {
                if (items.length === 0)
                    return of(items);
                return combineLatest(items.map(i => {
                    return collectionData(query(collection(this.firestore, `ylists/${i.id}/items`)), { idField: 'id' }).pipe(
                        map(subColl => {
                            i.items = subColl;
                            return i;
                        })
                    );
                }));
            })
        );
    }
    
    get data(): Observable<List[]> {
        return this.data$;
    }

    getList(id: string) {
        return docData(doc(this.firestore, `ylists/${id}`), { idField: 'id' }).pipe(
            map(value => this.mapObjectToList(value)),
            switchMap((item: List) => {
                if (!item)
                    return of(item);
                return collectionData(query(collection(this.firestore, `ylists/${item.id}/items`)), { idField: 'id' }).pipe(
                    map(subColl => {
                        item.items = subColl;
                        return item;
                    })
                );
            })
        );
    }

    async deleteList(id: string) {
        await deleteDoc(doc(this.firestore, `ylists/${id}`));
    }

    async deleteLists(ids: string[]) {
        if (!ids || ids.length === 0)
            return new Promise(() => null);
        let batch = writeBatch(this.firestore);
        ids.forEach(id => batch.delete(doc(this.firestore, `ylists/${id}`)));
        return batch.commit();
    }

    async addList(list: List) {
        await addDoc(collection(this.firestore, 'ylists'), list);
    }

    async updateList(list: List) {
        await updateDoc(doc(this.firestore, `ylists/${list.id}`), (list as { [x: string]: any }));
    }

    async findListByName(name: string) {
        return await firstValueFrom(collectionData(this.getYListsQuery()).pipe(
            map(value => (value && value.length > 0) ? value.find(i => i['name'].toLowerCase() === name.toLowerCase()) : null)
        ));
    }

    async findLists(searchText: string) {
        const normalizedSearchText = searchText.toLowerCase();
        return await firstValueFrom(collectionData(this.getYListsQuery(), { idField: 'id' }).pipe(
            map(value => (value && value.length > 0) ? value.filter(i => i['name'].toLowerCase().indexOf(normalizedSearchText) > -1) : null),
            switchMap((items: List[]) => {
                if (items.length === 0)
                    return of(items);
                return combineLatest(items.map(i => {
                    return collectionData(query(collection(this.firestore, `ylists/${i.id}/items`)), { idField: 'id' }).pipe(
                        map(subColl => {
                            i.items = subColl;
                            return i;
                        })
                    );
                }));
            })
        ));
    }

    addItem(listId: string, item: any) {
        return new Observable<void>(subscriber => {
            addDoc(collection(this.firestore, `ylists/${listId}/items`), item).then(resp => {
                subscriber.next();
                subscriber.complete();
            }).catch(e => {
                subscriber.error(e);
            });
        });
    }

    getItem(listId: string, itemId: string) {
        return docData(doc(this.firestore, `ylists/${listId}/items/${itemId}`));
    }

    updateItem(listId: string, item: any) {
        return new Observable<void>(subscriber => {
            updateDoc(doc(this.firestore, `ylists/${listId}/items/${item.id}`), (item as { [x: string]: any })).then(resp => {
                subscriber.next();
                subscriber.complete();
            }).catch(e => {
                subscriber.error(e);
            });
        });
    }

    updateItems(listId: string, items: any[]) {
        return new Observable<void>(subscriber => {
            let batch = writeBatch(this.firestore);
            items.forEach(item => batch.update(doc(this.firestore, `ylists/${listId}/items/${item.id}`), item));
            batch.commit().then(resp => {
                subscriber.next();
                subscriber.complete();
            }).catch(e => {
                subscriber.error(e);
            });
        });
    }

    deleteItems(listId: string, items: any[]) {
        return new Observable<void>(subscriber => {
            let batch = writeBatch(this.firestore);
            items.forEach(item => batch.delete(doc(this.firestore, `ylists/${listId}/items/${item.id}`)));
            batch.commit().then(resp => {
                subscriber.next();
                subscriber.complete();
            }).catch(e => {
                subscriber.error(e);
            });
        });
    }

    private getYListsQuery(...constraints: QueryConstraint[]) {
        return query(
            collection(this.firestore, 'ylists'),
            ...[
                where('userIds', 'array-contains', this.auth.currentUser?.uid),
                ...constraints
            ]
        );
    }

    mapObjectToList(obj: any) {
        let newList = new List();
        newList.id = obj.id;
        newList.userIds = obj.userIds;
        newList.uids = obj.uids;
        newList.name = obj.name;
        newList.items = obj.items;
        newList.itemsCount = obj.itemsCount;

        return newList;
    }
}