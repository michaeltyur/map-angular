import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, Place, ServerResponse, ImagesRequest, PlaceImages, BookImages } from '../models/firebase-collection-models';

@Injectable({
  providedIn: 'root'
})
export class AspService {

  remoteUrl: string = "";

  constructor(
    private http: HttpClient
  ) {

    if (!window.location.href.includes("localhost")) {
      this.remoteUrl = "https://live-project.space";
    }
  }

  // Place
  addPlace(place: Place): Observable<ServerResponse> {
    let url = this.remoteUrl + `/api/PlaceBook/AddPlace`;
    return this.http.post<ServerResponse>(url, place);
  }
  updatePlace(place: Place): Observable<ServerResponse> {
    let url = this.remoteUrl + `/api/PlaceBook/UpdatePlace`;
    return this.http.post<ServerResponse>(url, place);
  }
  getAllPlaces(): Observable<Place[]> {
    let url = this.remoteUrl + `/api/PlaceBook/GetAllPlaces`;
    return this.http.get<Place[]>(url);
  }
  deletePlace(placeID: number): Observable<ServerResponse> {
    let url = this.remoteUrl + `/api/PlaceBook/DeletePlace?placeID=${placeID}`;
    return this.http.get<ServerResponse>(url);
  }
  getPlaceImagesByParentID(parentID: number): Observable<PlaceImages[]> {
    let url = this.remoteUrl + `/api/PlaceBook/GetPlaceImagesByParentID?parentID=${parentID}`;
    return this.http.get<PlaceImages[]>(url);
  }

  // Book
  addBook(book: Book): Observable<ServerResponse> {
    let url = this.remoteUrl + `/api/PlaceBook/AddBook`;
    return this.http.post<ServerResponse>(url, book);
  }
  updateBook(book: Book): Observable<ServerResponse> {
    let url = this.remoteUrl + `/api/PlaceBook/UpdateBook`;
    return this.http.post<ServerResponse>(url, book);
  }
  getAllBooks(): Observable<Book[]> {
    let url = this.remoteUrl + `/api/PlaceBook/GetAllBooks`;
    return this.http.get<Book[]>(url);
  }
  deleteBook(bookID: number): Observable<ServerResponse> {
    let url = this.remoteUrl + `/api/PlaceBook/DeleteBook?placeID=${bookID}`;
    return this.http.get<ServerResponse>(url);
  }
  getBookImagesByParentID(parentID: number): Observable<BookImages[]> {
    let url = this.remoteUrl + `/api/PlaceBook/GetBookImagesByParentID?parentID=${parentID}`;
    return this.http.get<BookImages[]>(url);
  }

  // Image
  uploadFiles(formData: FormData): Observable<ServerResponse> {
    let url = this.remoteUrl + `/api/PlaceBook/UploadFiles`;
    return this.http.post<ServerResponse>(url, formData);
  }
  deleteFile(imageId: number, parentType: string): Observable<ServerResponse> {
    let url = this.remoteUrl + `/api/PlaceBook/DeleteImageFile?imageID=${imageId}&parentType=${parentType}`;
    return this.http.get<ServerResponse>(url);
  }
}
