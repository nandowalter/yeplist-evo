import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { icon_arrow_left, icon_plus, icon_save } from '../icon/icon-set';

@Component({
    selector: 'app-item-edit-page',
    templateUrl: 'item-edit-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'fixed top-0 left-0 h-full w-screen'}
})

export class ItemEditPageComponent implements OnInit {
    dataGroup = new FormGroup({
        name: new FormControl('', [ Validators.required, Validators.maxLength(25) ]),
        category: new FormControl('generico'),
        qty: new FormControl(1, [ Validators.max(999) ]),
        um: new FormControl(''),
        notes: new FormControl('',[ Validators.maxLength(100) ])
    });
    private readonly errorConfig: {[key:string]: {[key:string]: string}} = {
        name: {
            required: 'Informazione obbligatoria',
            maxlength: 'Lunghezza massima 25 caratteri'
        }
    };
    icons = {
        arrowLeft: icon_arrow_left,
        plus: icon_plus,
        save: icon_save
    };

    constructor() { }

    ngOnInit() { }

    save() {

    }

    getErrorMessage(fieldName: string, errors: any) {
        if (!errors)
            return '';
        
        return this.errorConfig[fieldName][errors.required ? 'required' : Object.keys(errors)[0]];
    }
}