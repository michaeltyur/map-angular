import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Place } from '../models/coordinates';
import { Observable } from 'rxjs';
import { Book } from '../models/book-model';

@Injectable({
  providedIn: 'root'
})
export class FireBaseService {

  places$:Observable<Place[]>;
  //places:Place[] = [];
  constructor(private firestore: AngularFirestore) {
    this.places$ = this.getPlaces();
   }

  getPlaces():Observable<any> {
    return this.firestore.collection('places').snapshotChanges();
  }
  createPlace(place: Place):Promise<any> {
    let clearName = place.name.replace(/\s+/g, '').toLowerCase();
    return this.firestore.collection('places').doc(clearName).set({...place});
  }
  deletePlace(placeID: string) {
    this.firestore.doc('places/' + placeID).delete();
  }
  getBooks():Observable<any> {
    return this.firestore.collection('books').snapshotChanges();
  }
  createBook(book: Book):Promise<any> {
    let clearName = book.name.replace(/\s+/g, '').toLowerCase();
    return this.firestore.collection('books').doc(clearName).set({...book});
  }
  // setPlacesArray(): void {
  //   this.getPlaces().subscribe(data => {
  //     this.places = data.map(e => {
  //       return {
  //         id: e.payload.doc.id,
  //         ...e.payload.doc.data()
  //       } as Place;
  //     })
  //   });
  // }
}
