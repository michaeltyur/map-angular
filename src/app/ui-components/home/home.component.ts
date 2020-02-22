import { Component, OnInit } from '@angular/core';
import { Place } from 'src/app/shared/models/coordinates';
import { FireBaseService } from 'src/app/shared/services/fire-base.service';
import { Book } from 'src/app/shared/models/book-model';
import { Router } from '@angular/router';
import { NbSidebarService } from '@nebular/theme';
import { SearchService } from 'src/app/shared/services/search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  places: Place[];
  books:Book[];
  book:Book;
  searchTerm:string;

  constructor(
    private fireBaseService: FireBaseService,
    private sidebarService: NbSidebarService,
    private router:Router,
    private searchService:SearchService
    ) {
      this.book = new Book();
     }

  ngOnInit(): void {
    this.getPlaces();
    this.getBooks();
    this.searchService.searchTextInBookTermEmitter$.subscribe((data)=>{
      this.searchTerm = data;
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
    });
  }

  goToMap(place:Place):void{
   // this.router.navigate(['/google-map'],{queryParams:{latitude:place.latitude,longitude:place.longitude}});

    this.router.navigate(['/google-map',place.latitude,place.longitude]);
  }

}
