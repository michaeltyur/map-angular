import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FireBaseService } from 'src/app/shared/services/fire-base.service';
import { NbToastrService, NbMenuService, NB_WINDOW, NbSidebarService } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';
import { SearchService } from 'src/app/shared/services/search.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { Place, Book, PlaceImages, BookImages } from 'src/app/shared/models/firebase-collection-models';

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

  // PlaceImages
  placeImages: PlaceImages = new PlaceImages();

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
    private fireBaseService: FireBaseService,
    private nbToastrService: NbToastrService,
    private sidebarService: NbSidebarService,
    @Inject(NB_WINDOW) private window,
    private searchService: SearchService,
  ) {
    this.place = new Place();
    this.book = new Book();
    this.placeImages = new PlaceImages();
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
        this.getPlaceImages(res.id);
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
    this.subscription.add(this.fireBaseService.getPlaceImagesByDocID(docID).subscribe(data => {
      this.placeImages = data as PlaceImages;
    }));

  }

  getBookImages(docID: string): void {
    this.fireBaseService.getBookImagesByDocID(docID).subscribe(data => {
      this.bookImages = data.data() as BookImages;
    })
  }

  savePlace(): void {

    if (this.isPlaceExist(this.place)) {
      this.nbToastrService.warning("", "The place already exists");
      return;
    }

    if (this.isPlaceValid()) {
      this.loading = true;
      this.fireBaseService.createPlace(this.place, this.placeImages).then(data => {
        let clearName = this.place.name.replace(/\s+/g, '').toLowerCase();
        this.placeImages.id = clearName;
        this.fireBaseService.createPlaceImages(this.placeImages).then(() => {
          this.nbToastrService.success("", "Added!!!");
          this.loading = false;
          //this.place = new Place();
        });

      }).catch((error) => {
        this.loading = false;
        this.nbToastrService.danger("", error);
      });
    }
  }

  saveBook(): void {
    if (this.isBookValid()) {

      this.loading = true;
      this.fireBaseService.createBook(this.book, this.bookImages).then(data => {
        this.nbToastrService.success("", "Added!!!");
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
        this.nbToastrService.danger("", error);
      });
    }
  }

  isPlaceValid(): boolean {
    let result = true;
    if (!this.place.name) {
      this.nbToastrService.warning("", "Please enter place name");
      return false;
    }
    return result;
  }

  isBookValid(): boolean {
    let result = true;
    if (!this.book.name) {
      this.nbToastrService.warning("", "Please enter book name");
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

  searchBook(): void {

  }

  getPlaces(): void {
    this.subscription.add(this.fireBaseService.getPlaces().subscribe(data => {
      this.places = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Place;
      })
    }));

  }

  updatePlace(): void {

    if (this.isPlaceValid()) {
      this.loading = true;
      this.fireBaseService.updatePlace(this.place, this.placeImages).then(() => {
        this.fireBaseService.updatePlaceImages(this.placeImages).then(() => {
          this.nbToastrService.success("", "Updated");
          this.loading = false;
        });
      }).catch((error) => {
        this.loading = false;
        console.error(error);
        this.nbToastrService.danger("", "Error")
      })
    }
  }

  updateBook(): void {

    if (this.isBookValid()) {
      this.loading = true;
      this.fireBaseService.updateBook(this.book, this.bookImages).then(() => {
        this.nbToastrService.success("", "Updated");
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
        console.error(error);
        this.nbToastrService.danger("", "Error");
      })
    }
  }

  private isPlaceExist(place: Place): boolean {
    return this.places.filter(el => el.name === place.name).length > 0;
  }

  getBooks(): void {
    this.subscription.add(this.fireBaseService.getBooks().subscribe(data => {
      this.books = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Book;
      })
      this.book = this.books[0];
      this.getBookImages(this.book.id);
    }));

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
      if (this.place.id) {
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

  deletePlace(): void {
    if (this.place) {
      this.fireBaseService.deletePlace(this.place.id).then(() => {
        this.place = new Place();
        this.placeImages = new PlaceImages();
        this.nbToastrService.success("", "Deleted");
      }).catch(err => console.error(err))
    }
  }

  handleFileSelect(evt) {

    let files = evt.target.files;

    if (!files.length) {
      this.nbToastrService.warning("", "Please select image");
      return;
    }

    Object.keys(files).forEach(key => {

      const file = files[key];

      let sizeKb = file.size / 1024;

      if (sizeKb > 500) {
        if (this.isPlaceTab) {
          this.placeFilesToUpload = null;
        }
        else {
          this.bookFilesToUpload = null;
        }
        this.nbToastrService.warning("", `File ${file.name} too big`);
      }
      else if (this.isPlaceTab && this.placeImages.images.length >= this.maxNumberOfImages
        || !this.isPlaceTab && this.bookImages.images.length >= this.maxNumberOfImages) {
        this.nbToastrService.warning("", `Maximun number of images is ${this.maxNumberOfImages}`);
        return;
      }
      else {
        if (files && file) {
          var reader = new FileReader();
          reader.onload = this.handleReaderLoaded.bind(this);
          reader.readAsBinaryString(file);
        }
      }


    })
  }

  private handleReaderLoaded(readerEvt) {
    let binaryString = readerEvt.target.result;
    let base64textString = btoa(binaryString);
    if (base64textString) {

      if (this.isPlaceTab) {
        this.placeImages.images.unshift(base64textString);
      }
      else {
        this.bookImages.images.unshift(base64textString);
      }
      this.nbToastrService.success("", "Image added");
    }
    else {
      this.nbToastrService.warning("", "Error loading image");
    }
  }

  deleteFromImageArray(index: number): void {
    if (this.placeImages.images) {
      this.placeImages.images.splice(index, 1);
    }
  }

  deleteFromBookImageArray(index: number): void {
    if (this.bookImages.images.length) {
      this.bookImages.images.splice(index, 1);
    }

  }

  addNew(): void {
    if (this.isPlaceTab) {
      this.place = new Place();
      this.placeImages = new PlaceImages();
    }
    else {
      this.book = new Book();
      this.bookImages = new BookImages();
    }
  }

}

