import { Injectable, EventEmitter } from '@angular/core';
import { Place } from '../coordinates';

@Injectable({
  providedIn: 'root'
})
export class MapNavigationService {

 coordinatEmitter$ = new EventEmitter<Place>();

  constructor() { }

  mapNavigateTo(place:Place):void{
    this.coordinatEmitter$.emit(place);
  }

}
