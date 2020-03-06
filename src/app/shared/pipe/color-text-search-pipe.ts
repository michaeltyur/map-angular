import { Pipe, PipeTransform } from '@angular/core';
import { element } from 'protractor';

@Pipe({
  name: 'ColorTextSearch'
})

export class ColorTextSearchPipe implements PipeTransform {

  transform(value: string, args: any): any {
    if (!args) { return value; }

    var txtElement = document.createElement("textarea");
    txtElement.innerHTML = value;
    let text = txtElement.value;


    let re = new RegExp(args, 'gi'); //'gi' for case insensitive and can use 'g' if you want the search to be case sensitive.
    let result = text.replace(re, `<span class="colored-text">${args}</span>`);

    return result;
  }

  private decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }
}

