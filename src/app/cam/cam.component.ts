import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { icon_x } from '../icon/icon-set';

@Component({
    selector: 'app-cam',
    templateUrl: 'cam.component.html',
    styleUrls: [ 'cam.component.css' ],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class CamComponent implements AfterViewInit, OnDestroy {
    @ViewChild('container') containerElement: ElementRef<HTMLVideoElement>;
    @ViewChild('video') videoElement: ElementRef<HTMLVideoElement>;
    @ViewChild('canvas') canvasElement: ElementRef<HTMLCanvasElement>;
    @ViewChild('photo') photoElement: ElementRef<HTMLImageElement>;
    @Output() close = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<string>();
    videoLoaded: boolean;
    stream: MediaStream;
    shooted: boolean;
    streaming: boolean;
    width: number;
    height: number;
    readonly icons = {
        x: icon_x
    };

    constructor() { }

    ngAfterViewInit() {
        this.initCam();
    }

    ngOnDestroy() {
        this.disableCam();
    }

    async initCam() {
        this.width = this.containerElement.nativeElement.clientWidth;
        this.height = (this.width * 16 / 9); //Aspect ratio 16/9;
        this.stream = await navigator.mediaDevices.getUserMedia(
            { 
                video: {
                    width: { min: this.width, max: this.width },
                    height: { min: this.height, max: this.height},
                }, 
                audio: false 
            }
        );
        this.videoElement.nativeElement.srcObject = this.stream;
        this.shooted = false;
    }

    disableCam() {
        this.streaming = false;
        if (this.stream) {
            this.stream.getTracks().forEach(function(track) {
                track.stop();
            });
        }
    }

    onCloseClick() {
        this.close.emit();
    }

    onVideoCanPlay() {
        if (!this.streaming) {
            this.videoElement.nativeElement.setAttribute('width', this.width.toString());
            this.videoElement.nativeElement.setAttribute('height', this.height.toString());
            this.canvasElement.nativeElement.setAttribute('width', this.width.toString());
            this.canvasElement.nativeElement.setAttribute('height', this.height.toString());
            this.streaming = true;
        }
    }

    onCircleClick() {
        this.shooted = true;
        this.disableCam();
        this.canvasElement.nativeElement.width = this.width;
        this.canvasElement.nativeElement.height = this.height;
        this.canvasElement.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
   	    let image_data_url = this.canvasElement.nativeElement.toDataURL('image/jpeg');
        this.photoElement.nativeElement.src = image_data_url;
    }

    onCancelButtonClick() {
        this.initCam();
    }

    onConfirmButtonClick() {
        this.confirm.emit(this.photoElement.nativeElement.src);
        this.close.emit();
    }
}