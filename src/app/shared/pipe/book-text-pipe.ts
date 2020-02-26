import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'BookTextConcater'
})

export class BookTextConcaterPipe implements PipeTransform {
  transform(value: string, lehgth?: number): any {

    if (!value) return null;

    if(!lehgth)lehgth = 50;

    if(value.length<=lehgth)return value;

    return value.substr(value.indexOf(":") + 1, lehgth) + " ...";
  }
}
