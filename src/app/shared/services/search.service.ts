import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  sideBarSelectItemEmitter$ = new EventEmitter();
  searchTextInBookTermEmitter$ = new EventEmitter();
  placeDetailsEmitter$ = new EventEmitter();
  placeDetailsClosedEmitter$ = new EventEmitter<boolean>();
  isLayoutHeaderVisibleEmitter$ = new EventEmitter<boolean>();

  constructor() { }
}
