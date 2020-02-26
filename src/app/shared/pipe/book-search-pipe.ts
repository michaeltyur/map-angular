import { Pipe, PipeTransform } from '@angular/core';
import { Place } from '../models/firebase-collection-models';

@Pipe({
    name: 'SearchBookFilter'
})

export class SearchBookPipe implements PipeTransform {
    transform(value: Place[], args?: any): any {

        if(!value)return null;
        if(!args)return value;

        args = args.toLowerCase();

        return value.filter((item)=>item.name.toLowerCase().includes(args.toLowerCase()));
    }
}
