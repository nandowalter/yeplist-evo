import { ChangeDetectionStrategy, Component, OnInit, Optional } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { icon_arrow_left, icon_save } from '../icon/icon-set';
import { List } from '../_models/list';
import { MainDataService } from '../_services/main-data.service';

@Component({
    selector: 'app-list-edit-page',
    templateUrl: 'list-edit-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListEditPageComponent implements OnInit {
    icons = {
        save: icon_save,
        arrowLeft: icon_arrow_left
    };
    dataGroup: FormGroup = new FormGroup({
        name: new FormControl('', [ Validators.required, Validators.maxLength(25) ])
    });

    constructor(
        @Optional() private auth: Auth,
        private router: Router,
        private mainData: MainDataService
    ) { }

    ngOnInit() { }

    async save() {
        await this.mainData.addList({ name: this.dataGroup.get('name')?.value, userIds: [this.auth.currentUser?.uid] } as List);
        this.dataGroup.reset();
        this.router.navigate(['lists']);
    }

    getErrorMessage(fieldName: string, errors: any) {
        if (!errors)
            return '';
        let errorConfig: {[key:string]: {[key:string]: string}} = {
            name: {
                required: 'Informazione obbligatoria',
                maxlength: 'Lunghezza massima 25 caratteri'
            }
        };

        return errorConfig[fieldName][errors.required ? 'required' : Object.keys(errors)[0]];


    }
}