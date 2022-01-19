import { ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, collectionData, doc, CollectionReference, DocumentData, addDoc, query, where, deleteDoc } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { List } from 'src/app/_models/list';
import { MainDataService } from 'src/app/_services/main-data.service';

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
        @Optional() private auth: Auth,
        private mainData: MainDataService
    ) {
        this.data$ = mainData.data;
    }

    ngOnInit() {
        
    }

    deleteList(id?: string) {
        if (!id)
            return;
        this.mainData.deleteList((id as string));
    }
}