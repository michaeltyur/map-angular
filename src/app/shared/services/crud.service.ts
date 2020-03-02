import { Injectable, EventEmitter } from '@angular/core';
import { Place } from '../models/firebase-collection-models';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  newPlaceAddedEmitter$ = new EventEmitter<Place>();
  updatePlaceEmitter$ = new EventEmitter<Place>();

  constructor() { }
}
