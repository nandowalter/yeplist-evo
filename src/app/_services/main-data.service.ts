import { Injectable, Optional } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, query, QueryConstraint, updateDoc, where, writeBatch } from '@angular/fire/firestore';
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

    private getYListsQuery(...constraints: QueryConstraint[]) {
        return query(
            collection(this.firestore, 'ylists'),
            ...[
                where('userIds', 'array-contains', this.auth.currentUser?.uid),
                ...constraints
            ]
        );
    }
}