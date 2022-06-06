import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Optional, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { concat, of, switchMap, take, tap } from 'rxjs';
import { icon_arrow_left, icon_qrcode, icon_save, icon_x } from '../icon/icon-set';
import { List } from '../_models/list';
import { MainDataService } from '../_services/main-data.service';
import QrScanner from 'qr-scanner';

@Component({
    selector: 'app-list-create-page',
    templateUrl: 'list-create-page.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {'class': 'fixed top-0 left-0 h-full w-screen z-30'}
})
export class ListCreatePageComponent {
    @ViewChild('nameInput') nameInput: ElementRef;
    @ViewChild('videoCam') private videoCamElement: ElementRef;
    icons = {
        save: icon_save,
        arrow_left: icon_arrow_left,
        qrcode: icon_qrcode,
        x: icon_x
    };
    dataGroup: FormGroup = new FormGroup({
        name: new FormControl('', [ Validators.required, Validators.maxLength(100) ])
    });
    private readonly errorConfig: {[key:string]: {[key:string]: string}} = {
        name: {
            required: 'Informazione obbligatoria',
            maxlength: 'Lunghezza massima 100 caratteri',
            notUnique: 'Nome già utilizzato'
        }
    };
    qrScannerVisible: boolean;
    qrScanner: any;

    constructor(
        @Optional() private auth: Auth,
        private router: Router,
        private route: ActivatedRoute,
        private mainData: MainDataService,
        private cd: ChangeDetectorRef
    ) { }

    async save() {
        let decodedValue;
        try {
            decodedValue = atob(this.dataGroup.get('name')?.value);
        } catch(e) {
            decodedValue = null;
        }

        if (decodedValue?.indexOf('_$_') > -1) {
            this.importSharedList(...(decodedValue.split('_$_') as [string, string]))
        } else {
            this.saveNewList();
        }
    }

    importSharedList(listId: string, updateToken: string) {
        concat(
            this.mainData.updateList(listId, { updateToken, tempAllowedUserId: this.auth.currentUser?.uid} as any),
            this.mainData.getList(listId).pipe(
                take(1),
                switchMap(list => {
                    if (list.userIds.indexOf(this.auth.currentUser?.uid) === -1) {
                        return this.mainData.updateList(list.id, { userIds: [ ...list.userIds, this.auth.currentUser?.uid ], tempAllowedUserId: null } as any);
                    }

                    return of(list);
                })
            )
        ).subscribe({
            complete: () => {
                this.dataGroup.reset();
                this.router.navigate(['..'], { relativeTo: this.route });
                this.cd.markForCheck();
            }
        });
    }

    async saveNewList() {
        let name = this.dataGroup.get('name')?.value;
        let result = await this.mainData.findListByName(name);
        if(result != null) {
            this.dataGroup.controls['name'].setErrors({
                notUnique: true
            });
            this.cd.markForCheck();
            (this.nameInput.nativeElement as HTMLElement).focus();
        } else {
            let newList = new List({ name, userIds: [this.auth.currentUser?.uid], ownerId: this.auth.currentUser?.uid, viewType: 'itemList', updateToken: `${Date.now()}` });
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

    activateQrCodeScanner() {
        this.qrScannerVisible = true;
        this.qrScanner = new QrScanner(this.videoCamElement.nativeElement, this.onQrCode, {});
        this.qrScanner.start();
    }

    closeQrCodeScanner() {
        this.qrScanner.stop();
        this.qrScannerVisible = false;
    }

    private onQrCode(result) {
        console.log('decoded qr code:', result);
    }
}