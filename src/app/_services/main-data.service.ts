import { Injectable, Optional } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, DocumentData, Firestore, Query, query, updateDoc, where } from '@angular/fire/firestore';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { List } from '../_models/list';

@Injectable({providedIn: 'root'})
export class MainDataService {
    private dataRef: Query<DocumentData>;
    private data$: Observable<List[]>;
    
    constructor(
        private firestore: Firestore,
        @Optional() private auth: Auth
    ) {
        this.dataRef = query(
            collection(this.firestore, 'ylists'),
            where('userIds', 'array-contains', this.auth.currentUser?.uid)
        );

        this.data$ = collectionData(this.dataRef, { idField: 'id' }).pipe(
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

    async addList(list: List) {
        await addDoc(collection(this.firestore, 'ylists'), list);
    }

    async updateList(list: List) {
        await updateDoc(doc(this.firestore, `ylists/${list.id}`), (list as { [x: string]: any }));
    }
}