import { ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { List } from '../_models/list';

@Component({
    selector: 'app-list-edit-page',
    templateUrl: 'list-edit-page.component.html',
    styleUrls: [ 'list-edit-page.component.css' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListEditPageComponent implements OnInit {
    dataGroup: FormGroup = new FormGroup({
        name: new FormControl('', [ Validators.required, Validators.maxLength(25) ])
    });

    constructor(
        private firestore: Firestore,
        @Optional() private auth: Auth,
        private router: Router
    ) { }

    ngOnInit() { }

    async save() {
        let ylistsColl = collection(this.firestore, 'ylists');
        let newDoc = await addDoc(ylistsColl, { name: this.dataGroup.get('name')?.value, userIds: [this.auth.currentUser?.uid], itemsCount: 0 } as List);
        this.dataGroup.reset();
        this.router.navigate(['lists']);
    }
}