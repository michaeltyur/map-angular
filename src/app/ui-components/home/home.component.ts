import { Component, OnInit } from '@angular/core';
import { Place } from 'src/app/shared/models/coordinates';
import { FireBaseService } from 'src/app/shared/services/fire-base.service';
import { Book } from 'src/app/shared/models/book-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  places: Place[];
  books:Book[];
  constructor(
    private fireBaseService: FireBaseService,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.getPlaces();
    this.getBooks();
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
      })
    });
  }

  goToMap(place:Place):void{
   // this.router.navigate(['/google-map'],{queryParams:{latitude:place.latitude,longitude:place.longitude}});

    this.router.navigate(['/google-map',place.latitude,place.longitude]);
  }

}
