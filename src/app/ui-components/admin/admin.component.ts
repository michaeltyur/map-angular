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
import { ParentType } from 'src/app/shared/models/enums';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  subscription = new Subscription();
  searchInBookTerm: string;
  imageNotAvalibleSrc = "https://live-project.space/Images/PlaceBookImages/no-image.png";

  // Places
  place: Place;
  places: Place[] = [];
  placeFiltred: Place;
  placeFilesToUpload: File;
  bookFilesToUpload: File;
  selectedFiles: File[];
  isMobile: boolean;
  // PlaceImages
  placeImagesArray: PlaceImages[] = [];

  // BookImages
  bookImagesArray: BookImages[] = [];

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
    private aspService: AspService,
    private deviceService: DeviceDetectorService,
  ) {
    this.place = new Place();
    this.book = new Book();
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
    // Close Details Menu
    this.searchService.placeDetailsEmitter$.emit(null);

    // Place Selected
    this.subscription.add(this.searchService.sideBarSelectItemEmitter$.subscribe((res: Place) => {
      if (res) {
        this.place = res;
        // get images
        this.getPlaceImages(res);
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

  getPlaceImages(place: Place): void {
    this.subscription.add(this.aspService.getPlaceImagesByParentID(place.placeID).subscribe((res: PlaceImages[]) => {
      if (res) {
        this.placeImagesArray = res;
      }
    }));

  }

  getBookImages(book: Book): void {
    this.subscription.add(this.aspService.getBookImagesByParentID(book.bookID).subscribe((res: BookImages[]) => {
      if (res) {
        this.bookImagesArray = res;
      }
    }));
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
          this.place.placeID = res.id;
          this.places.unshift(this.place);
          this.nbToastrService.success("", "Added!!!");
          this.loading = false;
          this.uploadFiles(this.selectedFiles, ParentType.place, this.place);
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
        if (res && !res.error) {
          this.nbToastrService.success("", "Updated");
          this.uploadFiles(this.selectedFiles, ParentType.place, this.place);
        }
        else {
          this.nbToastrService.warning("", res.error);
        }
        this.loading = false;
      }, error => {
        this.loading = false;
        console.error(error);
      }));


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
        this.getBookImages(this.book);
      }
    }, error => {
      console.error(error);
    }));

  }
  deletePlace(): void {

    if (this.place) {
      this.aspService.deletePlace(this.place.placeID).subscribe(res => {
        if (res) {
          this.place = new Place();
          this.placeImagesArray = [];
        }
      })
    }
  }

  // Book
  saveBook(): void {
    if (this.isBookValid()) {

      this.loading = true;
      this.subscription.add(this.aspService.addBook(this.book).subscribe((id) => {
        if (id) {
          this.uploadFiles(this.selectedFiles, ParentType.book, this.book);
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
        if (res && !res.error) {
          this.uploadFiles(this.selectedFiles, ParentType.book, this.book);
          this.nbToastrService.success("", "Updated");
        }
        else {
          this.nbToastrService.warning("", res.error);
        }
        this.loading = false;
      }, error => {
        this.loading = false;
        console.error(error);
      }));
    }

  }
  deleteBook(): void {
    if (this.book) {
      this.aspService.deleteBook(this.book.bookID).subscribe(res => {
        if (res) {
          this.book = null;
          this.bookImagesArray = [];
        }
      })
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
      if (this.book.bookID) {
        this.updateBook();
      }
      else {
        this.saveBook();
      }

    }
  }

  // Files
  handleFileSelect(event): void {
debugger;
    if (this.isPlaceTab && this.placeImagesArray.length > 5) {
      this.nbToastrService.warning("", "максимальное количество картинок 5");
      return;
    }
    else if (this.bookImagesArray.length > 5) {
      this.nbToastrService.warning("", "максимальное количество картинок 5");
      return;
    }
  Object.keys(event.target.files).forEach(key=>{
      if (event.target.files[key].size/1024>500) {
         this.nbToastrService.warning("",`File ${event.target.files[key].name} too big`);
         delete event.target.files[key];
      }
    })

    this.selectedFiles = event.target.files;
  }

  uploadFiles(imagesInput: File[], parentType: ParentType, object: Place | Book): void {
    if (imagesInput && imagesInput.length) {


      let formData = new FormData();

      Object.keys(imagesInput).forEach(key => {
        formData.append("Files", imagesInput[key]);
      });
      if (parentType === ParentType.place) {
        formData.append("ParentID", object['placeID'].toString());
        formData.append("ParentName", object.name);
        formData.append("ParentType", "place");
      }
      if (parentType === ParentType.book) {
        formData.append("ParentID", object['bookID'].toString());
        formData.append("ParentName", object.name);
        formData.append("ParentType", "book");
      }

      this.aspService.uploadFiles(formData).subscribe((res) => {
        if (parentType === ParentType.place) {
          this.placeImagesArray = res.imagesData;
        }
        if (parentType === ParentType.book) {
          this.bookImagesArray = res.imagesData;
        }

      });

    }
  }

  deleteFromPlaceImageArray(item: PlaceImages): void {
    this.aspService.deleteFile(item.placeImagesID, "place").subscribe((res) => {
      if (res) {
        this.nbToastrService.success("", "Удалено");
        this.placeImagesArray = this.placeImagesArray.filter(el => el.placeImagesID !== item.placeImagesID);
      }
    })
  }

  deleteFromBookImageArray(item: BookImages): void {
    this.aspService.deleteFile(item.bookImagesID, "book").subscribe((res) => {
      if (res) {
        this.nbToastrService.success("", "Удалено");
        this.bookImagesArray = this.bookImagesArray.filter(el => el.bookImagesID !== item.bookImagesID);
      }
    })
  }

  addNew(): void {
    if (this.isPlaceTab) {
      this.place = new Place();
      this.placeImagesArray = [];
    }
    else {
      this.book = new Book();
      this.bookImagesArray = [];
    }
  }
  imageLoadError(event): void {
    event.target.src = this.imageNotAvalibleSrc;
  }

}

