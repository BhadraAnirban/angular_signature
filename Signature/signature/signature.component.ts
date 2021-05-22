import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { SignaturePad } from '../models/signature_pad';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements OnInit, AfterViewInit, OnChanges {
    signaturePad: SignaturePad;
    signatureText: string;
    canvas: HTMLCanvasElement;
    doEdit = false;
    ShowValidationMessage = false;
    canvasWidth = 250;
    canvasHeight = 120;
    imageWidth = this.canvasWidth - 20;
    @Output('signatureevent') signatureevent = new EventEmitter();
    @Input('signature') signature: string;
    @Input('getSignature') getSignature: boolean;
    @Input('isEditable') isEditable: boolean = true;
    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        for (let propName in changes) {
            if (propName == 'getSignature' && this.getSignature) {
                this.SaveSignature();
            }
        }
    }

    ngOnInit() {
        this.getScreenSize();        
        if (!this.signature) {
            this.doEdit = true;
        }
        this.ShowValidationMessage = false;
    }


 ngAfterViewInit() {
     this.canvas = <HTMLCanvasElement>document.getElementById('signature-pad');

    this.signaturePad = new SignaturePad(this.canvas, {
      backgroundColor: 'rgb(255, 255, 255)' // necessary for saving image as JPEG; can be removed is only saving as PNG or SVG
    });
 }

    @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
        if (window.innerWidth > 600) {
            this.canvasWidth = 380;
            this.canvasHeight = 180;
            this.imageWidth = 300;
        }
    }

    SaveSignature() {
        if (this.signaturePad.isEmpty() && (this.signatureText == '' || this.signatureText == undefined) && this.doEdit) {
            this.ShowValidationMessage = true;
    }
    else {
        this.signatureevent.emit(this.doEdit ? this.signaturePad.toDataURL('image/jpeg') : "");
            this.doEdit = false;
            this.ShowValidationMessage = false;
    }
    
}
    SignatureTextChanged() {
        this.signaturePad.clear();
        let ctx = this.canvas.getContext("2d");
        ctx.font = "80px Brush Script MT";
        if (this.signatureText.length > (window.innerWidth > 600 ? 10 : 7)) {
            let multipleCount = window.innerWidth > 600 ? 2.5 : 3.3;           
            let standardSize = (90 - this.signatureText.length * multipleCount);
            if (this.signatureText.length > 20) {
                multipleCount = window.innerWidth > 600 ? 1 : 1.5;
                //standardSize = standardSize - ((this.signatureText.length - 20) * multipleCount);
                standardSize = 26;
            }

            
            ctx.font = standardSize + "px Brush Script MT";
        }
      // Create gradient
        let gradient = ctx.createLinearGradient(0, 0, 10, 0);
      gradient.addColorStop(0," black");
        gradient.addColorStop(0.5, "black");
        gradient.addColorStop(1.0, "black");
      // Fill with gradient
      ctx.fillStyle = gradient;
        ctx.fillText(this.signatureText, 10, window.innerWidth > 600 ? 160 : 110);
    }

    ClearSignature() {
        this.signatureText = '';
        this.signaturePad.clear();
    }

}
