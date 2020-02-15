import { Component, OnInit, Inject } from '@angular/core';
import { Place } from 'src/app/shared/models/coordinates';
import { FireBaseService } from 'src/app/shared/services/fire-base.service';
import { NbToastrService, NbMenuService, NB_WINDOW } from '@nebular/theme';
import { filter,map } from 'rxjs/operators';
import { Book } from 'src/app/shared/models/book-model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  // Places
  place: Place;
  places: Place[] = [];
  placeFiltred: Place;
  // Books
  book: Book;
  books: Book[] = [];
  booksFiltred: Book;

  searchTerm:string;
  placesFiltred: NbContextMenuItem[] = [{title : ""}] ;
  searchStatus: string = "basic";
  isPlaceTab:boolean = true;


  constructor(
    private fireBaseService: FireBaseService,
    private nbToastrService: NbToastrService,
    private nbMenuService: NbMenuService,
    @Inject(NB_WINDOW) private window
  ) {
    this.place = new Place();
    this.book = new Book();
  }

  ngOnInit(): void {
    this.getPlaces();
    this.getBooks();
    this.nbMenuService.onItemClick()
    .pipe(
      filter(({ tag }) => tag === 'search-context-menu'),
      map(({ item: { title } }) => title),
    )
    .subscribe((title:string) =>{
      this.searchTerm = title;
      this.searchPlace();
    } );

  }

  savePlace(): void {
    if (this.place.name, this.place.latitude, this.place.longitude) {

      this.fireBaseService.createPlace(this.place).then(data => {
        this.nbToastrService.success("", "Added!!!");
        this.place = new Place();
      }).catch((error)=>{
        debugger;
        this.nbToastrService.danger("", error);
      });
    }
    else {
      this.nbToastrService.warning("", "Please, fill the fields");
    }
  }

  saveBook(): void {
    if (this.book.name) {
      this.fireBaseService.createBook(this.book).then(data => {
        this.nbToastrService.success("", "Added!!!");
        this.book = new Book();
      }).catch((error)=>{
        this.nbToastrService.danger("", error);
      });
    }
    else {
      this.nbToastrService.warning("", "Please, fill the fields");
    }
  }

  searchPlace(): void {
    this.placeFiltred = this.places.filter(el => el.name.toLowerCase() === this.searchTerm.toLowerCase())[0];
    this.placesFiltred = this.places.filter(el => el.name.toLowerCase().match(this.searchTerm.toLowerCase())).map(el => { return new NbContextMenuItem(el.name) });
    if (this.placeFiltred) {
      this.searchStatus = "success";
      this.place = this.placeFiltred;
    }
    else {
      this.searchStatus = "danger";
    }
  }

  searchBook():void{

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
 getBooks():void{
  this.fireBaseService.getBooks().subscribe(data => {
    this.books = data.map(e => {
      return {
        id: e.payload.doc.id,
        ...e.payload.doc.data()
      } as Book;
    })
  });
 }

 tabChanged(event):void{
  if(event.tabTitle==="Place"){
  this.isPlaceTab = true;
  }
   else{
    this.isPlaceTab = false;
   }
 }
 actionSaveSelect():void{
   if (this.isPlaceTab) {
    this.savePlace();
   }
   else{
    this.saveBook();
   }
 }
}


export class NbContextMenuItem {
  title: string;
  constructor(title: string) {
    this.title = title;
  }
}
