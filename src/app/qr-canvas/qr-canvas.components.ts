import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import QRCode from 'qrcode'

@Component({
    selector: 'app-qr-canvas',
    template: `
        <canvas #canvasEl></canvas>
    `,
    styleUrls: ['qr-canvas.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrCanvasComponent implements OnChanges {
    @ViewChild('canvasEl') private canvasEl: ElementRef;
    @Input() text: string;

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['text']) {
            QRCode.toCanvas(this.canvasEl.nativeElement, changes['text'].currentValue);
        }
    }
}