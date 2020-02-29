import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, Place, ServerResponse, ImagesRequest } from '../models/firebase-collection-models';

@Injectable({
  providedIn: 'root'
})
export class AspService {

  constructor(
    private http: HttpClient
  ) { }

  // Place
  addPlace(place: Place): Observable<ServerResponse> {
    let url = `/api/PlaceBook/AddPlace`;
    return this.http.post<ServerResponse>(url, place);
  }
  updatePlace(place: Place): Observable<ServerResponse> {
    let url = `/api/PlaceBook/UpdatePlace`;
    return this.http.post<ServerResponse>(url, place);
  }
  getAllPlaces(): Observable<Place[]> {
    let url = `/api/PlaceBook/GetAllPlaces`;
    return this.http.get<Place[]>(url);
  }
  deletePlace(placeID: number): Observable<ServerResponse> {
    let url = `/api/PlaceBook/DeletePlace?placeID=${placeID}`;
    return this.http.get<ServerResponse>(url);
  }

  // Book
  addBook(book: Book): Observable<ServerResponse> {
    let url = `/api/PlaceBook/AddBook`;
    return this.http.post<ServerResponse>(url, book);
  }
  updateBook(book: Book): Observable<ServerResponse> {
    let url = `/api/PlaceBook/UpdateBook`;
    return this.http.post<ServerResponse>(url, book);
  }
  getAllBooks(): Observable<Book[]> {
    let url = `/api/PlaceBook/GetAllBooks`;
    return this.http.get<Book[]>(url);
  }
  deleteBook(bookID: number): Observable<ServerResponse> {
    let url = `/api/PlaceBook/DeleteBook?placeID=${bookID}`;
    return this.http.get<ServerResponse>(url);
  }

  // Image
  uploadFiles(formData: FormData): Observable<ServerResponse> {
    let url = `/api/PlaceBook/UploadFiles`;
    return this.http.post<ServerResponse>(url, formData);
  }
}
