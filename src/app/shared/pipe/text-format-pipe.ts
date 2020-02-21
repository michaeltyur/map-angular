import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'TextFormat'
})

export class TextFormatPipe implements PipeTransform {

    transform(value: any): any {
        if (!value) {return value;}
       // var re = new RegExp(args, 'gi'); //'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
       let result = value.replace(/\n/g,'<br />');
       return result;
    }
}
