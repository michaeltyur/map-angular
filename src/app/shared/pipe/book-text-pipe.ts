import { Pipe, PipeTransform } from '@angular/core';
import { Place } from '../models/coordinates';

@Pipe({
  name: 'BookTextConcater'
})

export class BookTextConcaterPipe implements PipeTransform {
  transform(value: string, args?: any): any {

    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();

    return value.substr(value.indexOf(":") + 1, 50) + " ...";
  }
}
