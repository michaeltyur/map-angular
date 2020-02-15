import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Place } from '../models/coordinates';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireBaseService {

  constructor(private firestore: AngularFirestore) { }

  getPlaces():Observable<any> {
    return this.firestore.collection('places').snapshotChanges();
  }
  createPlace(place: Place):Promise<any> {
    //return this.firestore.collection('places').add({...place});
    return this.firestore.collection('places').doc(place.name).set({...place});
  }
  deletePlace(placeID: string) {
    this.firestore.doc('places/' + placeID).delete();
  }
}
