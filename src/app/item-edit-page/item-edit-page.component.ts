import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, debounceTime, filter, map, Observable, Subscription, tap } from 'rxjs';
import { icon_arrow_left, icon_camera, icon_light_bulb, icon_pencil, icon_plus, icon_save, icon_trash, icon_x } from '../icon/icon-set';
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
    @ViewChild('video') video: ElementRef<HTMLVideoElement>;
    dataGroup: FormGroup;
    private readonly errorConfig: {[key:string]: {[key:string]: string}} = {
        name: {
            required: 'Informazione obbligatoria',
            maxlength: 'Lunghezza massima 25 caratteri',
            notUnique: 'Nome già esistente in lista'
        },
        qty: {
            min: 'Qta minima 1',
            max: 'Qta massima 999'
        },
        notes: {
            maxlength: 'Lunghezza massima 100 caratteri'
        }
    };
    readonly icons = {
        arrow_left: icon_arrow_left,
        plus: icon_plus,
        save: icon_save,
        x: icon_x,
        lightBulb: icon_light_bulb,
        pencil: icon_pencil,
        camera: icon_camera,
        trash: icon_trash
    };
    state$: Observable<ItemEditState>;
    nameTextBoxFocus: boolean;
    suggestionsExpanded = false;
    nameTextBoxChange$$: Subscription;
    videoEnabled: boolean;
    fullscreenImageUrl: string;
    readonly MIN_VALUE = 1;
    readonly MAX_VALUE = 999;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private pageStore: ItemEditStore,
        private cd: ChangeDetectorRef,
        @Inject(DOCUMENT) private document: Document
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
            qty: new FormControl(1, [ Validators.min(1), Validators.max(999), Validators.maxLength(6) ]),
            um: new FormControl(''),
            notes: new FormControl('',[ Validators.maxLength(100) ]),
            imageUrls: new FormControl([]),
            newImages: new FormControl([])
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
        if (this.dataGroup.get('id').value != null) {
            this.pageStore.updateItem({ listId, item: new ListItem(this.dataGroup.value) });
        } else {
            this.pageStore.addItem({ listId, item: new ListItem(this.dataGroup.value) });
        }
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
        this.dataGroup.patchValue({ name: item.name, category: item.category, um: item.um, imageUrls: item.imageUrls, newImages: [] });
        this.pageStore.clearSuggestions();
    }

    toggleSuggestionsExpand() {
        this.suggestionsExpanded = !this.suggestionsExpanded;
    }

    onFileChange(e: Event) {
        if ((e.target as HTMLInputElement).files) {
            let file = (e.target as HTMLInputElement).files[0];
            const reader = new FileReader();

            reader.addEventListener("load", (e) => {
                var img = this.document.createElement("img");
                img.onload = (event) => {
                    var MAX_WIDTH = 1024;
                    var MAX_HEIGHT = 1024;

                    var width = img.width;
                    var height = img.height;

                    // Change the resizing logic
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = height * (MAX_WIDTH / width);
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = width * (MAX_HEIGHT / height);
                            height = MAX_HEIGHT;
                        }
                    }

                    var canvas = this.document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    // Show resized image in preview element
                    let dataUrl = canvas.toDataURL("image/webp", 0.6);
                    this.dataGroup.patchValue({
                        imageUrls: [],
                        newImages: [dataUrl]
                    });
                    this.cd.markForCheck();
                }
                img.src = e.target.result as string;
            }, false);

            reader.readAsDataURL(file);
        }

    }

    removePhoto() {
        this.dataGroup.patchValue({
            imageUrls: [],
            newImages: []
        });
    }

    getImageCompleteUrl(imageUrl: string) {
        return `https://firebasestorage.googleapis.com/v0/b/yeplist-evo.appspot.com/o/${encodeURIComponent(imageUrl)}?alt=media`;
    }

    showImage(imageUrl: string) {
        this.fullscreenImageUrl = imageUrl;
        let actualViewport = this.document.head.querySelector('meta[name="viewport"]').getAttribute('content');
        this.document.head.querySelector('meta[name="viewport"]').setAttribute('content', actualViewport.replace(', minimum-scale=1, maximum-scale=1, user-scalable=no', ''));
    }

    hideImage() {
        let actualViewport = this.document.head.querySelector('meta[name="viewport"]').getAttribute('content');
        this.document.head.querySelector('meta[name="viewport"]').setAttribute('content',`${actualViewport}, minimum-scale=1, maximum-scale=1, user-scalable=no`);
        this.fullscreenImageUrl = undefined;
    }

    decreaseQty(control: AbstractControl, minValue: number) {
        if (control.value === minValue)
            return;

        control.patchValue((control.value > minValue) ? control.value - 1 : 1);
    }

    increaseQty(control: AbstractControl, maxValue: number) {
        if (control.value === maxValue)
            return;

        let fallbackValue = control.value > maxValue ? maxValue : 1;
        control.patchValue((control.value >= 0) && (control.value < maxValue) ? control.value + 1 : fallbackValue);
    }
}