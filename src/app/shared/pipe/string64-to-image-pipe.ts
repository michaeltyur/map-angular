import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { noImage } from '../models/no-image-string';

@Pipe({
    name: 'String64ToImage'
})

export class String64ToImagePipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer){

  }

    transform(value: any): any {

        if (!value) {value = noImage}

       let result = 'data:image/jpg;base64,' + (this.sanitizer.bypassSecurityTrustResourceUrl(value) as any).changingThisBreaksApplicationSecurity;

       return result;
    }
}
