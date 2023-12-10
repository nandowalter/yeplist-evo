import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import QRCode from 'qrcode'

@Component({
    selector: 'app-qr-canvas',
    template: `
        <canvas #canvasEl></canvas>
    `,
    styleUrls: ['qr-canvas.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrCanvasComponent implements OnChanges, AfterViewInit {
    @ViewChild('canvasEl') private canvasEl: ElementRef;
    @Input() text: string;

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        this.initCanvas(changes['text'].currentValue);
    }

    ngAfterViewInit(): void {
        this.initCanvas(this.text);
    }

    private initCanvas(text: string) {
        if (text && this.canvasEl?.nativeElement)
            QRCode.toCanvas(this.canvasEl.nativeElement, text);
    }
}