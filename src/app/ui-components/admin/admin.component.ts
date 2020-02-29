import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FireBaseService } from 'src/app/shared/services/fire-base.service';
import { NbToastrService, NbMenuService, NB_WINDOW, NbSidebarService } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';
import { SearchService } from 'src/app/shared/services/search.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Place, Book, PlaceImages, BookImages, ServerResponse, ImagesRequest } from 'src/app/shared/models/firebase-collection-models';
import { AspService } from 'src/app/shared/services/asp.service';
import { error } from 'protractor';
import { PlaceDetailComponent } from '../place-detail/place-detail.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  subscription = new Subscription();
  searchInBookTerm: string;
  // Places
  place: Place;
  places: Place[] = [];
  placeFiltred: Place;
  placeFilesToUpload: File;
  bookFilesToUpload: File;
  selectedFiles: File[];

  // PlaceImages
  placesImages: PlaceImages[] = [];

  // BookImages
  bookImages: BookImages = new BookImages();

  // Books
  book: Book;
  books: Book[] = [];
  booksFiltred: Book;

  loading: boolean = false;
  imageDownloadPath: string;
  searchTerm: string;
  searchStatus: string = "basic";
  isPlaceTab: boolean = true;
  maxNumberOfImages = 5;

  constructor(
    private nbToastrService: NbToastrService,
    private sidebarService: NbSidebarService,
    @Inject(NB_WINDOW) private window,
    private searchService: SearchService,
    private aspService: AspService
  ) {
    this.place = new Place();
    this.book = new Book();
   // this.placeImages = new PlaceImages();
    this.bookImages = new BookImages();
  }

  ngOnInit(): void {
    this.getPlaces();
    this.getBooks();
    this.sidebarService.expand();
    // Close Details Menu
    this.searchService.placeDetailsEmitter$.emit(null);

    // Place Selected
    this.subscription.add(this.searchService.sideBarSelectItemEmitter$.subscribe((res: Place) => {
      if (res) {
        this.place = res;
        // get images
        //this.getPlaceImages(res.id);
      }
    }));

    // Search in Book
    this.subscription.add(this.searchService.searchTextInBookTermEmitter$.subscribe(res => {
      this.searchInBookTerm = res;
    }));

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getPlaceImages(docID: string): void {
    // this.subscription.add(this.fireBaseService.getPlaceImagesByDocID(docID).subscribe(data => {
    //   this.placeImages = data as PlaceImages;
    // }));

  }

  getBookImages(docID: string): void {
    // this.fireBaseService.getBookImagesByDocID(docID).subscribe(data => {
    //   this.bookImages = data.data() as BookImages;
    // })
  }

  // Place
  savePlace(): void {

    if (this.isPlaceExist(this.place)) {
      this.nbToastrService.warning("", "The place already exists");
      return;
    }

    if (this.isPlaceValid()) {
      this.loading = true;
      this.subscription.add(this.aspService.addPlace(this.place).subscribe((res: ServerResponse) => {
        if (res) {
          this.place.placeID = res.ID;
          this.places.unshift(this.place);
          this.nbToastrService.success("", "Added!!!");
          this.loading = false;
          this.uploadFiles(this.selectedFiles, this.place);
        }
        else {
          this.nbToastrService.danger("", "Not added!!!");
          this.loading = false;
        }
      }, error => {
        this.loading = false;
        this.nbToastrService.danger("", error);
      }));

    }
  }
  isPlaceValid(): boolean {
    let result = true;

    if (!this.place) {
      this.nbToastrService.warning("", "Place is null");
      return false;
    }

    if (!this.place.name) {
      this.nbToastrService.warning("", "Please enter place name");
      return false;
    }
    return result;
  }
  searchPlace(): void {
    this.placeFiltred = this.places.filter(el => el.name.toLowerCase() === this.searchTerm.toLowerCase())[0];
    if (this.placeFiltred) {
      this.searchStatus = "success";
      this.place = this.placeFiltred;
    }
    else {
      this.searchStatus = "danger";
    }
  }
  getPlaces(): void {
    this.subscription.add(this.aspService.getAllPlaces().subscribe((places: Place[]) => {
      if (places && places.length) {
        this.places = places;
      }
    }, error => {
      console.error(error);
    }));
  }
  updatePlace(): void {

    if (this.isPlaceValid()) {
      this.loading = true;

      this.subscription.add(this.aspService.updatePlace(this.place).subscribe((res: ServerResponse) => {
        if (res && !res.Error) {
          this.nbToastrService.success("", "Updated");
        }
        else {
          this.nbToastrService.warning("", res.Error);
        }
        this.loading = false;
      }, error => {
        this.loading = false;
        console.error(error);
      }));

      this.uploadFiles(this.selectedFiles, this.place);

    }
  }
  private isPlaceExist(place: Place): boolean {
    return this.places.filter(el => el.name === place.name).length > 0;
  }
  getBooks(): void {

    this.subscription.add(this.aspService.getAllBooks().subscribe((books: Book[]) => {
      if (books && books.length) {
        this.books = books;
        this.book = books.filter(el => el.name === "Кижские Рассказы")[0];
      }
    }, error => {
      console.error(error);
    }));

  }
  deletePlace(): void {

    if (this.place) {
      this.aspService.deletePlace(this.place.placeID)
    }
  }



  // Book
  saveBook(): void {
    if (this.isBookValid()) {

      this.loading = true;
      this.subscription.add(this.aspService.addBook(this.book).subscribe((id) => {
        if (id) {
          this.nbToastrService.success("", "Added!!!");
          this.loading = false;
        }
        else {
          this.nbToastrService.danger("", "Not added!!!");
          this.loading = false;
        }
      }, error => {
        this.loading = false;
        this.nbToastrService.danger("", error);
      }));
    }
  }
  isBookValid(): boolean {
    let result = true;
    if (!this.book.name) {
      this.nbToastrService.warning("", "Please enter book name");
      return false;
    }

    return result;
  }
  searchBook(): void {

  }
  updateBook(): void {

    if (this.isBookValid()) {

      this.loading = true;

      this.subscription.add(this.aspService.updateBook(this.book).subscribe((res: ServerResponse) => {
        if (res && !res.Error) {
          this.nbToastrService.success("", "Updated");
        }
        else {
          this.nbToastrService.warning("", res.Error);
        }
        this.loading = false;
      }, error => {
        this.loading = false;
        console.error(error);
      }));
    }

  }


  tabChanged(event): void {
    if (event.tabTitle === "Place") {
      this.isPlaceTab = true;
      this.sidebarService.expand();
    }
    else {
      this.isPlaceTab = false;
      this.sidebarService.collapse();
    }
  }

  actionSaveSelect(): void {
    if (this.isPlaceTab) {
      if (this.place.placeID) {
        this.updatePlace();
      }
      else {
        this.savePlace();
      }

    }
    else {
      this.saveBook();
    }
  }

  // Files

  handleFileSelect(event): void {
    this.selectedFiles = event.target.files;
  }
  uploadFiles(imagesInput: File[], place?: Place, book?: Book): void {
    if (imagesInput && imagesInput.length) {
      let formData = new FormData();

      Object.keys(imagesInput).forEach(key => {
        formData.append("Files", imagesInput[key]);
      });
      if (place) {
        formData.append("ParentID", place.placeID.toString());
        formData.append("ParentName", place.name);
        formData.append("ParentType", "place");
      }
      if (book) {
        formData.append("ParentID", book.bookID.toString());
        formData.append("ParentName", book.name);
        formData.append("ParentType", "book");
      }

      this.aspService.uploadFiles(formData).subscribe((res) => {
      debugger;
      });
      // form.append();
      // formData.append("name", this.form.get('name').value);

    }
  }

  deleteFromImageArray(index: number): void {
    // if (this.placeImages.images) {
    //   this.placeImages.images.splice(index, 1);
    // }
  }

  deleteFromBookImageArray(index: number): void {
    // if (this.bookImages.images.length) {
    //   this.bookImages.images.splice(index, 1);
    // }

  }

  addNew(): void {
    if (this.isPlaceTab) {
      this.place = new Place();
      this.placesImages = [];
    }
    else {
      this.book = new Book();
      this.bookImages = new BookImages();
    }
  }

  copyToSQL(): void {
    this.places.forEach(el => {
      this.aspService.addPlace(el).subscribe(res => {
        console.log(res);
      })
    }, error => console.error(error))

    this.books.forEach(el => {
      this.aspService.addBook(el).subscribe(res => {
        console.log(res)
      })
    }, error => console.error(error))

  }

}

