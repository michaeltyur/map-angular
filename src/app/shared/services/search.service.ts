import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

sideBarSelectItemEmitter$ = new EventEmitter();

  constructor() { }
}
