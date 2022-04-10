import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, debounceTime, filter, map, Observable, Subscription, take, tap } from 'rxjs';
import { icon_arrow_left, icon_chevron_down, icon_chevron_up, icon_light_bulb, icon_pencil, icon_plus, icon_save, icon_x } from '../icon/icon-set';
import { KnownItem } from '../_models/known-item';
import { ListItem } from '../_models/list-item';
import { ItemEditState, ItemEditStore } from './item-edit.store';

@Component({
    selector: 'app-item-edit-page',
    templateUrl: 'item-edit-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'fixed top-0 left-0 h-full w-screen z-30'},
    providers: [
        ItemEditStore
    ]
})

export class ItemEditPageComponent implements OnInit, OnDestroy {
    dataGroup: FormGroup;
    private readonly errorConfig: {[key:string]: {[key:string]: string}} = {
        name: {
            required: 'Informazione obbligatoria',
            maxlength: 'Lunghezza massima 25 caratteri',
            notUnique: 'Nome già esistente in lista'
        },
        qty: {
            max: 'Numero massimo 999'
        },
        notes: {
            maxlength: 'Lunghezza massima 100 caratteri'
        }
    };
    readonly icons = {
        arrowLeft: icon_arrow_left,
        plus: icon_plus,
        save: icon_save,
        x: icon_x,
        lightBulb: icon_light_bulb,
        pencil: icon_pencil
    };
    state$: Observable<ItemEditState>;
    nameTextBoxFocus: boolean;
    suggestionsExpanded = false;
    nameTextBoxChange$$: Subscription;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private pageStore: ItemEditStore
    ) { 
        this.initForm();
    }

    ngOnInit() {
        this.state$ = this.pageStore.state$.pipe(tap(value => {
            if (value?.item && this.dataGroup.get('id').value === null) {
                this.dataGroup.patchValue(value.item.toObject());
            }
            
            if (value.listId) {
                this.dataGroup.patchValue({ listId: value.listId });
            }

            if (value?.error?.field && value.error.validationError) {
                this.dataGroup.controls['name'].setErrors({
                    notUnique: true
                });
            }

            if (value?.saved) {
                this.router.navigate([value?.item ? '../..' : '..'], { relativeTo: this.route });
            }
        }));

        combineLatest([
            this.route.parent.paramMap.pipe(map(value => value.get('listId'))),
            this.route.paramMap.pipe(map(value => value.get('itemId')))
        ]).subscribe(values => this.pageStore.getItem({ listId: values[0], itemId: values[1]}));
    }

    ngOnDestroy(): void {
        if (this.nameTextBoxChange$$)
            this.nameTextBoxChange$$.unsubscribe();
    }

    initForm() {
        this.dataGroup = new FormGroup({
            id: new FormControl(null),
            listId: new FormControl(null),
            name: new FormControl('', [ Validators.required, Validators.maxLength(25) ]),
            category: new FormControl('generico'),
            qty: new FormControl(1, [ Validators.max(999) ]),
            um: new FormControl(''),
            notes: new FormControl('',[ Validators.maxLength(100) ])
        });

        if (this.nameTextBoxChange$$)
            this.nameTextBoxChange$$.unsubscribe();

        this.nameTextBoxChange$$ = this.dataGroup.get('name').valueChanges.pipe(
            filter(() => this.nameTextBoxFocus && this.dataGroup.get('name').dirty),
            debounceTime(250),
            tap(value => value.length < 4 ? this.pageStore.clearSuggestions() : null),
            filter(value => value.length >= 4), 
        ).subscribe(value => this.nameTextBoxFocus ? this.pageStore.getNameSuggestions({ listId: this.dataGroup.get('listId').value, searchText: value.toLowerCase(), currentItemId: this.dataGroup.get('id').value }) : null);
    }

    save(listId: string) {
        this.pageStore.saveItem({ listId, item: new ListItem(this.dataGroup.value) });
    }

    getErrorMessage(fieldName: string, errors: any) {
        if (!errors)
            return '';
        
        return this.errorConfig[fieldName][errors.required ? 'required' : Object.keys(errors)[0]];
    }

    onSuggestionExistingClick(item: ListItem) {
        this.suggestionsExpanded = false;
        this.pageStore.clearSuggestions();
        if (this.dataGroup.get('id').value != null) {
            this.initForm();
            this.pageStore.clearState();
            this.router.navigate(['..', item.id], {relativeTo: this.route });
        } else {
            this.router.navigate([item.id], {relativeTo: this.route });
        }
    }

    onSuggestionKnownClick(item: KnownItem) {
        this.suggestionsExpanded = false;
        this.dataGroup.patchValue({ name: item.name, category: item.category, um: item.um });
        this.pageStore.clearSuggestions();
    }

    toggleSuggestionsExpand() {
        this.suggestionsExpanded = !this.suggestionsExpanded;
    }
}