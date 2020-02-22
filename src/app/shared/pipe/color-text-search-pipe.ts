import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ColorTextSearch'
})

export class ColorTextSearchPipe implements PipeTransform {

  transform(value: string, args: any): any {
    if (!args) { return value; }
    let re = new RegExp(args, 'gi'); //'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
    let result = value.replace(re, `<span class="colored-text">${args}</span>`);

    return result;
  }
}
