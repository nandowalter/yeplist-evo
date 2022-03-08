import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of, switchMap, take } from 'rxjs';
import { icon_arrow_left, icon_plus, icon_save } from '../icon/icon-set';
import { MainDataService } from '../_services/main-data.service';

@Component({
    selector: 'app-item-edit-page',
    templateUrl: 'item-edit-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'fixed top-0 left-0 h-full w-screen z-30'}
})

export class ItemEditPageComponent implements OnInit {
    dataGroup = new FormGroup({
        name: new FormControl('', [ Validators.required, Validators.maxLength(25) ]),
        category: new FormControl('generico'),
        qty: new FormControl(1, [ Validators.max(999) ]),
        um: new FormControl(''),
        notes: new FormControl('',[ Validators.maxLength(100) ])
    });
    loading$ = new BehaviorSubject<boolean>(false);
    private readonly errorConfig: {[key:string]: {[key:string]: string}} = {
        name: {
            required: 'Informazione obbligatoria',
            maxlength: 'Lunghezza massima 25 caratteri'
        },
        qty: {
            max: 'Numero massimo 999'
        },
        notes: {
            maxlength: 'Lunghezza massima 100 caratteri'
        }
    };
    icons = {
        arrowLeft: icon_arrow_left,
        plus: icon_plus,
        save: icon_save
    };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dataService: MainDataService,
        private cd: ChangeDetectorRef
    ) {
        
    }

    ngOnInit() { }

    save() {
        this.loading$.next(true);
        this.route.parent.paramMap.pipe(
            take(1),
            switchMap(value => this.dataService.addItem(value.get('listId'), this.dataGroup.value))
        ).subscribe({
            complete: () => {
                this.loading$.next(false);
                this.dataGroup.reset();
                this.router.navigate(['..'], { relativeTo: this.route });
                this.cd.markForCheck();
            }   
        });
    }

    getErrorMessage(fieldName: string, errors: any) {
        if (!errors)
            return '';
        
        return this.errorConfig[fieldName][errors.required ? 'required' : Object.keys(errors)[0]];
    }
}