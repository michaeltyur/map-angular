import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { noImage } from '../models/no-image-string';

@Pipe({
    name: 'ImageSrcDomsanitization'
})

export class ImageSrcDomsanitizationPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer){}

    transform(value: any): any {

        if (!value) {value = noImage}

       let result = this.sanitizer.bypassSecurityTrustUrl(value);

       return result;
    }
}
