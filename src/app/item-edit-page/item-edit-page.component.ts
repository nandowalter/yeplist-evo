import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, of, switchMap, take, tap } from 'rxjs';
import { icon_arrow_left, icon_plus, icon_save } from '../icon/icon-set';
import { MainDataService } from '../_services/main-data.service';

@Component({
    selector: 'app-item-edit-page',
    templateUrl: 'item-edit-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'fixed top-0 left-0 h-full w-screen z-30'}
})

export class ItemEditPageComponent implements OnInit {
    listId: string;
    itemId: string;
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

    ngOnInit() {
        this.loading$.next(true);
        combineLatest([
            this.route.parent.paramMap.pipe(take(1), map(value => value.get('listId'))),
            this.route.paramMap.pipe(take(1), map(value => value.get('itemId')))
        ]).pipe(
            tap(values => {
                this.listId = values[0];
                this.itemId = values[1];
            }),
            switchMap(values => values[1] ? this.dataService.getItem(values[0], values[1]) : of(null))
        ).subscribe({
            next: (value: any) => {
                this.loading$.next(false);
                if (value) {
                    this.dataGroup.patchValue({
                        name: value.name,
                        category: value.category,
                        qty: value.qty,
                        um: value.um,
                        notes: value.notes
                    });
                }
                this.cd.markForCheck();
            }   
        });
    }

    save() {
        this.loading$.next(true);
        (this.itemId ? 
            this.dataService.updateItem(this.listId, { id: this.itemId, ...this.dataGroup.value }) 
            : 
            this.dataService.addItem(this.listId, this.dataGroup.value)
        ).subscribe({
            complete: () => {
                this.loading$.next(false);
                this.dataGroup.reset();
                this.router.navigate([this.itemId ? '../..' : '..'], { relativeTo: this.route });
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