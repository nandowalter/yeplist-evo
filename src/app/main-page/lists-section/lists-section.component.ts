import { ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, collectionData, doc, CollectionReference, DocumentData, addDoc, query, where, deleteDoc } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { icon_plus, icon_trash } from 'src/app/icon/icon-set';
import { List } from 'src/app/_models/list';
import { MainDataService } from 'src/app/_services/main-data.service';

@Component({
    selector: 'app-lists-section',
    templateUrl: 'lists-section.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListsSectionComponent implements OnInit {
    icons = {
        trash: icon_trash,
        plus: icon_plus
    };
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