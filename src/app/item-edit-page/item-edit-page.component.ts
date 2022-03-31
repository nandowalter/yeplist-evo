import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { icon_arrow_left, icon_plus, icon_save } from '../icon/icon-set';
import { ListItem } from '../_models/list-item';
import { MainDataService } from '../_services/main-data.service';
import { ItemEditState, ItemEditStore } from './item-edit.store';

@Component({
    selector: 'app-item-edit-page',
    templateUrl: 'item-edit-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'fixed top-0 left-0 h-full w-screen z-30'},
    providers: [
        ItemEditStore
    ],
})

export class ItemEditPageComponent implements OnInit {
    dataGroup = new FormGroup({
        id: new FormControl(null),
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
    state$: Observable<ItemEditState>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dataService: MainDataService,
        private cd: ChangeDetectorRef,
        private pageStore: ItemEditStore
    ) { }

    ngOnInit() {
        this.state$ = this.pageStore.state$.pipe(tap(value => {
            if (value?.item && this.dataGroup.get('id').value === null) {
                this.dataGroup.patchValue({
                    id: value.item.id,
                    name: value.item.name,
                    category: value.item.category,
                    qty: value.item.qty,
                    um: value.item.um,
                    notes: value.item.notes
                });
            }

            if (value?.saved) {
                this.dataGroup.reset();
                this.pageStore.updateSaved(false);
                this.router.navigate([value?.item ? '../..' : '..'], { relativeTo: this.route });
            }
        }));

        this.pageStore.getItem(combineLatest([
            this.route.parent.paramMap.pipe(take(1), map(value => value.get('listId'))),
            this.route.paramMap.pipe(take(1), map(value => value.get('itemId')))
        ]).pipe(
            map(values => ({ listId: values[0], itemId: values[1] }))
        ));
    }

    save(listId: string) {
        this.pageStore.saveItem({ listId, item: new ListItem(this.dataGroup.value) });
    }

    getErrorMessage(fieldName: string, errors: any) {
        if (!errors)
            return '';
        
        return this.errorConfig[fieldName][errors.required ? 'required' : Object.keys(errors)[0]];
    }
}