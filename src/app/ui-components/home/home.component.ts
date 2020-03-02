import { Component, OnInit, OnDestroy } from '@angular/core';
import { FireBaseService } from 'src/app/shared/services/fire-base.service';
import { Router } from '@angular/router';
import { NbSidebarService } from '@nebular/theme';
import { SearchService } from 'src/app/shared/services/search.service';
import { Place, Book, BookImages } from 'src/app/shared/models/firebase-collection-models';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AspService } from 'src/app/shared/services/asp.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  places: Place[];
  books: Book[];
  bookImagesArray: BookImages[];
  book: Book;
  searchTerm: string;
  isMobile: boolean;

  constructor(
    private aspService: AspService,
    private sidebarService: NbSidebarService,
    private router: Router,
    private searchService: SearchService,
    private deviceService: DeviceDetectorService,

  ) {
    this.book = new Book();
    this.bookImagesArray = [];
  }

  ngOnInit(): void {
    
    this.isMobile = this.deviceService.isMobile();
    if (!this.isMobile) {
      this.sidebarService.expand();
    }
    else {
      this.sidebarService.collapse();
    }

    this.getPlaces();
    this.getBooks();

    this.searchService.placeDetailsEmitter$.emit(null);

    this.subscription.add(this.searchService.searchTextInBookTermEmitter$.subscribe((data) => {
      this.searchTerm = data;
    }));

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getBookImages(id: number): void {
    this.subscription.add(this.aspService.getBookImagesByParentID(id).subscribe((res: BookImages[]) => {
      if (res) {
        this.bookImagesArray = res;
      }
    }));
  }

  getPlaces(): void {
    // this.subscription.add(this.fireBaseService.getPlaces().subscribe(data => {
    //   this.places = data.map(e => {
    //     return {
    //       id: e.payload.doc.id,
    //       ...e.payload.doc.data()
    //     } as Place;
    //   })

    // }));
  }

  getBooks(): void {
    this.subscription.add();
    this.aspService.getAllBooks().subscribe((books: Book[]) => {
      if (books && books.length) {
        this.book = books.filter(el => el.name === "Кижские Рассказы")[0];
        this.getBookImages(this.book.bookID);
      }
    })
  }

  goToMap(place: Place): void {
    this.router.navigate(['/google-map', place.latitude, place.longitude]);
  }

}
