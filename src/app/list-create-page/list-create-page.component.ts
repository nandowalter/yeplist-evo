import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Optional, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { icon_arrow_left, icon_save } from '../icon/icon-set';
import { List } from '../_models/list';
import { MainDataService } from '../_services/main-data.service';

@Component({
    selector: 'app-list-create-page',
    templateUrl: 'list-create-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'fixed top-0 left-0 h-full w-screen z-30'}
})
export class ListCreatePageComponent {
    @ViewChild('nameInput') nameInput: ElementRef;
    icons = {
        save: icon_save,
        arrow_left: icon_arrow_left
    };
    dataGroup: FormGroup = new FormGroup({
        name: new FormControl('', [ Validators.required, Validators.maxLength(25) ])
    });
    private readonly errorConfig: {[key:string]: {[key:string]: string}} = {
        name: {
            required: 'Informazione obbligatoria',
            maxlength: 'Lunghezza massima 25 caratteri',
            notUnique: 'Nome già utilizzato'
        }
    };

    constructor(
        @Optional() private auth: Auth,
        private router: Router,
        private route: ActivatedRoute,
        private mainData: MainDataService,
        private cd: ChangeDetectorRef
    ) { }

    async save() {
        let name = this.dataGroup.get('name')?.value;
        let result = await this.mainData.findListByName(name);
        if(result != null) {
            this.dataGroup.controls['name'].setErrors({
                notUnique: true
            });
            this.cd.markForCheck();
            (this.nameInput.nativeElement as HTMLElement).focus();
        } else {
            let newList = new List({ name, userIds: [this.auth.currentUser?.uid], viewType: 'itemList' });
            await this.mainData.addList(newList);
            this.dataGroup.reset();
            this.router.navigate(['..'], { relativeTo: this.route });
            this.cd.markForCheck();
        }
    }

    getErrorMessage(fieldName: string, errors: any) {
        if (!errors)
            return '';
        
        return this.errorConfig[fieldName][errors.required ? 'required' : Object.keys(errors)[0]];
    }
}