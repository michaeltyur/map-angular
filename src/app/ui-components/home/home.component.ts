import { Component, OnInit } from '@angular/core';
import { FireBaseService } from 'src/app/shared/services/fire-base.service';
import { Router } from '@angular/router';
import { NbSidebarService } from '@nebular/theme';
import { SearchService } from 'src/app/shared/services/search.service';
import { Place, Book, BookImages } from 'src/app/shared/models/firebase-collection-models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  places: Place[];
  books: Book[];
  bookImages: BookImages;
  book: Book;
  searchTerm: string;

  constructor(
    private fireBaseService: FireBaseService,
    private sidebarService: NbSidebarService,
    private router: Router,
    private searchService: SearchService
  ) {
    this.book = new Book();
    this.bookImages = new BookImages();
  }

  ngOnInit(): void {
    this.sidebarService.expand();
    this.getPlaces();
    this.getBooks();

    this.searchService.placeDetailsEmitter$.emit(null);

    this.searchService.searchTextInBookTermEmitter$.subscribe((data) => {
      this.searchTerm = data;
    })
  }

  getBookImages(docID: string): void {
    this.fireBaseService.getBookImagesByDocID(docID).subscribe(data => {
      this.bookImages = data.data();
    })
  }

  getPlaces(): void {
    this.fireBaseService.getPlaces().subscribe(data => {
      this.places = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Place;
      })

    });
  }

  getBooks(): void {
    this.fireBaseService.getBooks().subscribe(data => {
      this.books = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Book;
      });
      this.book = this.books[0];
      this.getBookImages(this.book.id);
    });
  }

  goToMap(place: Place): void {
    // this.router.navigate(['/google-map'],{queryParams:{latitude:place.latitude,longitude:place.longitude}});

    this.router.navigate(['/google-map', place.latitude, place.longitude]);
  }

}
