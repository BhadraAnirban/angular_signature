# Angular signature using canvas
### Inside the Signature folder you will find the mentioned files.

## Add the "model" folder in your app folder or the parent folder of the component folder where you want to implement the signature control. It has some typescript files.

## In the signature.component.ts-
```
import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { SignaturePad } from '../models/signature_pad';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements OnInit, AfterViewInit {
    signaturePad: SignaturePad;
    signatureText: string;
    canvas: HTMLCanvasElement;
    doEdit = false;
    ShowValidationMessage = false;
    canvasWidth = 250;
    canvasHeight = 120;
    imageWidth = this.canvasWidth - 20; // image is used to display the existing saved signature
    @Output('signatureevent') signatureevent = new EventEmitter();
    @Input('signature') signature: string; // already existing saved signature
    @Input('isEditable') isEditable: boolean = true;
    constructor() { }

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
// Emit an event which sends the image of the signature
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
// Optional function. But useful if you introduce typing the name to populate the signature.
// We are decreasing the font size with the increase the number of entered characters in the text box.
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


```

## In the signature.component.html-

```
<button id="save-jpeg" *ngIf="isEditable" [hidden]="!(signature && !doEdit)" class="btn bg-taj-blue btn-outline-dark btn-sm mr-2" (click)="doEdit = true;">Edit Signature</button>
<div [hidden]="!doEdit" class="col-span-6 sm:col-span-3">
  <b for="content">Type your name for signature:</b>
  <span style="color:red; padding-left: 26px;" *ngIf="ShowValidationMessage">Please type your name below for Signature or sign with mouse.</span>
  <input type="text" [hidden]="!doEdit" class="form-input" [(ngModel)]="signatureText" (change)="SignatureTextChanged();" (keyup)="SignatureTextChanged();" />
</div>
<div [hidden]="!doEdit">
  <b for="content">OR Sign with Mouse:</b>
</div>
<div class="wrapper">
  <canvas [hidden]="!doEdit" id="signature-pad" class="signature-pad" width={{canvasWidth}} height={{canvasHeight}} style="border: 2px solid blue;"></canvas>
  <img [hidden]="!(signature && !doEdit)" width={{imageWidth}} height={{canvasHeight}} src="{{signature}}" [ngClass]="{'signature-image': isEditable}" style="margin-top: 9px;" />
  <div>
 
  </div>
</div>


<button id="clear" [hidden]="!(!signature || doEdit)" class="btn bg-taj-blue btn-outline-dark btn-sm mr-2" (click)="ClearSignature();">Reset</button>


```
