import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Place } from '../models/coordinates';
import { Observable } from 'rxjs';
import { Book } from '../models/book-model';
import { tap, filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FireBaseService {

  places$: Observable<Place[]>;
  places: Place[] = [];
  //places:Place[] = [];
  constructor(private firestore: AngularFirestore) {
    this.places$ = this.getPlaces();
  }

  getPlaces(): Observable<any> {

    return this.firestore.collection<Place>('places',ref => ref
    .orderBy('name','asc'))
    .snapshotChanges()
    .pipe(
      tap(data=>this.places = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
               } as Place;
     })));

  }

  updatePlace(place: Place): Promise<any> {
    return this.firestore.collection('places').doc(place.id).set({ ...place });
  }
  updateBook(book: Book): Promise<any> {
    return this.firestore.collection('books').doc(book.id).set({ ...book });
  }
  createPlace(place: Place): Promise<any> {
    let clearName = place.name.replace(/\s+/g, '').toLowerCase();
    return this.firestore.collection('places').doc(clearName).set({ ...place });
  }
  deletePlace(placeID: string) {
    this.firestore.doc('places/' + placeID).delete();
  }
  getBooks(): Observable<any> {
    return this.firestore.collection('books').snapshotChanges();
  }
  createBook(book: Book): Promise<any> {
    let clearName = book.name.replace(/\s+/g, '').toLowerCase();
    return this.firestore.collection('books').doc(clearName).set({ ...book });
  }

}
