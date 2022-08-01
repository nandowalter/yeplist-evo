import { Injectable, Optional } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, query, QueryConstraint, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { setDoc } from 'firebase/firestore';
import { combineLatest, combineLatestAll, firstValueFrom, from, map, mapTo, Observable, of, switchMap, take } from 'rxjs';
import { KnownItem } from '../_models/known-item';
import { List } from '../_models/list';
import { ListItem } from '../_models/list-item';
import { ShareTokenData } from '../_models/share-token-data';
import { Storage, uploadString, ref as storageRef } from '@angular/fire/storage';

@Injectable({providedIn: 'root'})
export class MainDataService {
    private data$: Observable<List[]>;
    
    constructor(
        private firestore: Firestore,
        private storage: Storage,
        @Optional() private auth: Auth
    ) {
        this.data$ = collectionData(this.getYListsQuery(), { idField: 'id' }).pipe(
            map(values => values.map(v => new List(v))),
            switchMap((lists: List[]) => {
                if (lists.length === 0)
                    return of(lists);
                return combineLatest(lists.map(i => {
                    return collectionData(query(collection(this.firestore, `ylists/${i.id}/items`)), { idField: 'id' }).pipe(
                        map(subColl => i.patch({ items: Object.freeze(subColl.map(s => new ListItem(s)).sort(this.sortListItemsByName)) }))
                    );
                }));
            })
        );
    }
    
    get data(): Observable<List[]> {
        return this.data$;
    }

    getList(listId: string) {
        return docData(doc(this.firestore, `ylists/${listId}`), { idField: 'id' }).pipe(
            map(value => new List(value)),
            switchMap((item: List) => {
                if (!item)
                    return of(item);
                return collectionData(query(collection(this.firestore, `ylists/${item.id}/items`)), { idField: 'id' }).pipe(
                    map(subColl => item.patch({ items: Object.freeze(subColl.map(s => new ListItem(s)).sort(this.sortListItemsByName)) }))
                );
            })
        );
    }

    findItemInListByName(listId: string, name: string, exactMatch: boolean = true) {
        return docData(doc(this.firestore, `ylists/${listId}`), { idField: 'id' }).pipe(
            map(value => new List(value)),
            switchMap((item: List) => {
                if (!item?.id)
                    return of(undefined);
                return collectionData(query(collection(this.firestore, `ylists/${item.id}/items`)), { idField: 'id' }).pipe(
                    map(subColl => subColl.map(s => new ListItem(s)).filter(li => exactMatch ? (li.name.toLowerCase() === name.toLowerCase()) : (li.name.toLowerCase().indexOf(name.toLowerCase()) > -1)))
                );
            }),
            take(1)
        );
    }

    async deleteList(id: string) {
        await deleteDoc(doc(this.firestore, `ylists/${id}`));
    }

    deleteLists(ids: string[]) {
        return new Observable<void>(subscriber => {
            if (!ids || ids.length === 0)
                return subscriber.complete();
            let batch = writeBatch(this.firestore);
            ids.forEach(id => batch.delete(doc(this.firestore, `ylists/${id}`)));
            batch.commit().then(() => {
                subscriber.complete();
            })
            .catch(e => {
                subscriber.error(e);
            });
        });
    }

    async addList(list: List) {
        await addDoc(collection(this.firestore, 'ylists'), list.toObject());
    }

    updateList(listId: string, list: Partial<List>) {
        return from(updateDoc(doc(this.firestore, `ylists/${listId}`), list)).pipe(take(1));
    }

    multiBatch(updates: { listId: string, list: Partial<List> }[], deleteIds: string[] = []) {
        return new Observable<void>(subscriber => {
            let batch = writeBatch(this.firestore);

            if (deleteIds?.length > 0)
                deleteIds.forEach(id => batch.delete(doc(this.firestore, `ylists/${id}`)));

            if (updates?.length > 0)
                updates.forEach(update => batch.update(doc(this.firestore, `ylists/${update.listId}`), update.list));

            batch.commit().then(() => {
                subscriber.complete();
            })
            .catch(e => {
                subscriber.error(e);
            });
        });
    }

    async findListByName(name: string) {
        return await firstValueFrom(collectionData(this.getYListsQuery()).pipe(
            map(value => (value && value.length > 0) ? value.find(i => i['name'].toLowerCase() === name.toLowerCase()) : null)
        ));
    }

    async findLists(searchText: string) {
        const normalizedSearchText = searchText.toLowerCase();
        return await firstValueFrom(collectionData(this.getYListsQuery(), { idField: 'id' }).pipe(
            map(value => (value && value.length > 0) ? value.filter(i => i['name'].toLowerCase().indexOf(normalizedSearchText) > -1).map(i => new List(i)) : null),
            switchMap((items: List[]) => {
                if (items.length === 0)
                    return of(items);
                return combineLatest(items.map(i => {
                    return collectionData(query(collection(this.firestore, `ylists/${i.id}/items`)), { idField: 'id' }).pipe(
                        map(subColl => i.patch({ items: Object.freeze(subColl.map(s => new ListItem(s))) }))
                    );
                }));
            })
        ));
    }

    addItem(listId: string, item: ListItem) {
        let upload$: Observable<string>[];
        if (item.newImages?.length > 0) {
            upload$ = item.newImages.map((imageData, idx) => from(uploadString(storageRef(this.storage, `images/${listId}_${Math.floor(Math.random() * 1000)}_${Date.now()}.webp`), imageData, 'data_url')).pipe(map(result => result.ref.fullPath)));
        } else {
            upload$ = [of(null)];
        }

        return combineLatest(upload$).pipe(
            switchMap(uploadedImages => {
                item = new ListItem({ ...item, imageUrls: [ ...(item.imageUrls ?? []), ...(uploadedImages.filter(i => i) ?? []) ], newImages: undefined });
                return new Observable<ListItem>(subscriber => {
                    addDoc(collection(this.firestore, `ylists/${listId}/items`), item.toObject()).then(resp => {
                        subscriber.next(item);
                        subscriber.complete();
                    }).catch(e => {
                        subscriber.error(e);
                    });
                });
            })
        );
    }

    getItem(listId: string, itemId: string) {
        return docData(doc(this.firestore, `ylists/${listId}/items/${itemId}`), { idField: 'id' }).pipe(
            map(value => new ListItem(value))
        );
    }

    updateItem(listId: string, item: ListItem) {
        let upload$: Observable<string>[];
        if (item.newImages?.length > 0) {
            upload$ = item.newImages.map((imageData, idx) => from(uploadString(storageRef(this.storage, `images/${item.id}_${idx}_${Date.now()}.webp`), imageData, 'data_url')).pipe(map(result => result.ref.fullPath)));
        } else {
            upload$ = [of(null)];
        }

        return combineLatest(upload$).pipe(
            switchMap(uploadedImages => {
                item = new ListItem({ ...item, imageUrls: [ ...(item.imageUrls ?? []), ...(uploadedImages.filter(i => i) ?? []) ], newImages: undefined });
                return new Observable<ListItem>(subscriber => {
                    updateDoc(doc(this.firestore, `ylists/${listId}/items/${item.id}`), item.toObject()).then(resp => {
                        subscriber.next(item);
                        subscriber.complete();
                    }).catch(e => {
                        subscriber.error(e);
                    });
                });
            })
        );
    }

    updateItems(listId: string, items: ListItem[]) {
        return new Observable<void>(subscriber => {
            let batch = writeBatch(this.firestore);
            items.forEach(item => batch.update(doc(this.firestore, `ylists/${listId}/items/${item.id}`), item.toObject()));
            batch.commit().then(resp => {
                subscriber.next();
                subscriber.complete();
            }).catch(e => {
                subscriber.error(e);
            });
        });
    }

    deleteItems(listId: string, items: ListItem[]) {
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

    findItemsInLists(searchText: string): Observable<List[]> {
        return collectionData(this.getYListsQuery(), { idField: 'id' }).pipe(
            map(values => values.map(v => new List(v))),
            switchMap((lists: List[]) => {
                if (lists.length === 0)
                    return of([]);
                return combineLatest(lists.map(i => {
                    return collectionData(query(collection(this.firestore, `ylists/${i.id}/items`)), { idField: 'id' }).pipe(
                        map(subColl => i.patch({ items: Object.freeze(subColl.map(s => new ListItem(s))) }))
                    );
                })).pipe(
                    map(result => result.filter(r => r.items.find(i => i.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1) != null))
                );
            })
        );
    }

    addKnownItem(name: string, category: string, um: string, imageUrls: string[]) {
        const MIN = 4;
        let letters = [];
        if (name.length >= MIN) {
            let normName = name.toLowerCase();
            let splitted = normName.split('');
            splitted.forEach((s, index) => {
                if (index <= splitted.length - MIN) {
                    for (let i = MIN; (index + i) <= splitted.length; i++) {
                        letters.push(normName.slice(index, index + i));
                    }
                }
            });
        }

        return new Observable<void>(subscriber => {
            setDoc(doc(this.firestore, `users/${this.auth.currentUser?.uid}/knownitems/${name.toLowerCase()}`), { name, category, um, letters, imageUrls }).then(resp => {
                subscriber.next();
                subscriber.complete();
            }).catch(e => {
                subscriber.error(e);
            });
        });
    }

    findKnownItemByName(name: string) {
        return collectionData(query(
            collection(this.firestore, `users/${this.auth.currentUser?.uid}/knownitems`),
            where('letters', 'array-contains', name.toLowerCase())
        )).pipe(
            map(values => values ? values.map(i => new KnownItem(i)) : [])
        );
    }

    addShareToken(listId: string, updateToken: string) {
        let shareToken = Math.floor(Math.random() * 9999999).toString(16).toUpperCase();
        return from(addDoc(collection(this.firestore, `shareTokens`), { shareToken, listId, updateToken, timestamp: new Date() })).pipe(mapTo(shareToken));
    }

    getShareTokenData(shareToken: string): Observable<ShareTokenData> {
        return collectionData(query(
            collection(this.firestore, 'shareTokens'),
            where('shareToken', '==', shareToken)
        )).pipe(
            map(values => values?.[0] ? new ShareTokenData(values?.[0]) : null),
            take(1)
        );
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

    private sortListItemsByName(a: ListItem, b: ListItem) {
        const nameA = a.name.toLocaleLowerCase();
        const nameB = b.name.toLocaleLowerCase();
        return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
    }
}