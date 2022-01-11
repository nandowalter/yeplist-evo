import { ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, collectionData, doc, CollectionReference, DocumentData, addDoc, query, where } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { List } from 'src/app/_models/list';

@Component({
    selector: 'app-lists-section',
    templateUrl: 'lists-section.component.html',
    styleUrls: [ 'lists-section.component.css' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListsSectionComponent implements OnInit {
    data$: Observable<List[]>;
    
    constructor(
        private firestore: Firestore,
        @Optional() private auth: Auth
    ) {
        this.data$ = collectionData(query(
            collection(this.firestore, 'ylists'),
            where('userIds', 'array-contains', this.auth.currentUser?.uid)
        )).pipe(
            map(value => value.map(item => item as List))
        );
    }

    async ngOnInit() {
        // let ylistsColl = collection(this.firestore, 'ylists');
        // let newDoc = await addDoc(ylistsColl, { name: 'spesa sabato', userIds: [this.auth.currentUser?.uid], itemsCount: 1 } as List);
        // await addDoc(collection(this.firestore, `ylists/${newDoc.id}/items`), { name: 'test' });
    }
}