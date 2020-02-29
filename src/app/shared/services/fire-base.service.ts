import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { tap, filter, map } from 'rxjs/operators';
import { Place, Book, PlaceImages, BookImages } from '../models/firebase-collection-models';
import { FireBaseCollection } from '../models/enums';
import { NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class FireBaseService {

  places$: Observable<Place[]>;
  places: Place[] = [];
  //places:Place[] = [];
  constructor(
    private firestore: AngularFirestore,
     private nb: NbToastrService) {
    this.places$ = this.getPlaces();
  }
  // Test
  actionWithFireBase(): void {
    this.places.forEach(el => {
      if (el) {
        // el.images = null;
        // this.updatePlace(el).then();
        // this.createCopyOfPlace(el);
       // this.createPlace(el).then();
        //  let images = new PlaceImages();
        //  images.id = el.id;
        //  images.name = el.name;
        //  if(el.images)
        //   images.images = el.images;
        //   this.createPlaceImages(images).then();
        //   this.nb.warning("","Working...")
      }
    })

  }
  createCopyOfPlace(place: Place): void {
    let clearName = place.name.toLowerCase();
    this.firestore.collection('placesCopy').doc(clearName).set({ ...place }).then();
  }
  // End Test

  getDataByCollectionAndDocId(collection: string, docID: string): Observable<any> {
    return this.firestore.collection(collection).doc(docID).get();
  }

  // Place
  getPlaces(): Observable<any> {
    let test = "placesCopy"
    return this.firestore.collection<Place>(FireBaseCollection.places, ref => ref
      .orderBy('name', 'asc'))
      .snapshotChanges()
      .pipe(
        tap(data => this.places = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data()
          } as Place;
        })));

  }

 // createPlace(place: Place, images: PlaceImages): Promise<any> {
    // let clearName = place.name.replace(/\s+/g, '').toLowerCase();
    // return this.firestore.collection(FireBaseCollection.places).doc(clearName).set({ ...place }).then(() => {
    //   images.id = clearName;
    //   this.updatePlaceImages(images).then();
    // });
  //}
 // updatePlace(place: Place, images: PlaceImages): Promise<any> {
    // return this.firestore.collection(FireBaseCollection.places).doc(place.id).set({ ...place }).then(() => {
    //   images.id = place.id;
    //   this.updatePlaceImages(images).then();
    // });
 // }
  deletePlace(placeID: string): Promise<any> {
    return this.firestore.doc(FireBaseCollection.places + '/' + placeID).delete().then(()=>{
      this.deletePlaceImages(placeID).then();
    });
  }

  // Book
  getBooks(): Observable<any> {
    return this.firestore.collection(FireBaseCollection.books).snapshotChanges();
  }

  // createBook(book: Book, images: BookImages): Promise<any> {
  //   let clearName = book.name.replace(/\s+/g, '').toLowerCase();
  //   return this.firestore.collection(FireBaseCollection.books).doc(clearName).set({ ...book }).then(()=>{
  //     images.id = clearName;
  //     this.createBookImages(images).then();
  //   });
  // }
  // updateBook(book: Book, images: BookImages): Promise<any> {
  //   return this.firestore.collection(FireBaseCollection.books).doc(book.id).set({ ...book }).then(()=>{
  //     images.id = book.id;
  //     debugger;
  //     this.updateBookImages(images).then();
  //   });
  //}
  // deleteBook(bookID:string):Promise<any>{
  //   return this.firestore.doc(FireBaseCollection.books + '/' + bookID).delete().then(()=>{
  //     this.deleteBookImages(bookID).then();
  //   });
  // }

  // Place Images
  // createPlaceImages(placeImages: PlaceImages): Promise<any> {
  //   return this.firestore.collection(FireBaseCollection.placesImages).doc(placeImages.id).set({ ...placeImages });
  // }
  getPlaceImagesByDocID(placeImagesDocID: string): Observable<any> {
    return Observable.throw("");
    // return this.firestore.collection(FireBaseCollection.placesImages).doc(placeImagesDocID).get()
    //   .pipe(map(data => {
    //     return data.data();
    //   }));
  }
  // updatePlaceImages(placeImages: PlaceImages): Promise<any> {
  //   return this.firestore.collection(FireBaseCollection.placesImages).doc(placeImages.id).set({ ...placeImages });
  // }
  deletePlaceImages(placeImagesID: string): Promise<any> {
    return this.firestore.doc(FireBaseCollection.placesImages + '/' + placeImagesID).delete();
  }

  // Book Images
  // createBookImages(bookImages: BookImages): Promise<any> {
  //   return this.firestore.collection(FireBaseCollection.booksImages).doc(bookImages.id).set({ ...bookImages });
  // }
  getBookImagesByDocID(bookImagesDocID: string): Observable<any> {
    return Observable.throw("");
    // return this.firestore.collection(FireBaseCollection.booksImages).doc(bookImagesDocID).get();
  }
  // updateBookImages(bookImages: BookImages): Promise<any> {
  //   return this.firestore.collection(FireBaseCollection.booksImages).doc(bookImages.id).set({ ...bookImages });
  // }
  deleteBookImages(bookImagesID: string): Promise<any> {
    return this.firestore.doc(FireBaseCollection.booksImages + '/' + bookImagesID).delete();
  }
}
