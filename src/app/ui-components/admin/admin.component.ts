import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Place } from 'src/app/shared/models/coordinates';
import { FireBaseService } from 'src/app/shared/services/fire-base.service';
import { NbToastrService, NbMenuService, NB_WINDOW, NbSidebarService } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';
import { Book } from 'src/app/shared/models/book-model';
import { SearchService } from 'src/app/shared/services/search.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

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
  filesToUpload: File;

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
  }

  ngOnInit(): void {
    this.getPlaces();
    this.getBooks();
    this.sidebarService.expand();

    // Close Details Menu
    this.searchService.placeDetailsEmitter$.emit(null);

    // Place Selected
    this.subscription.add(this.searchService.sideBarSelectItemEmitter$.subscribe(res => {
      if (res) {
        this.place = res;
      }
    }));

    // Search in Book
    this.subscription.add();
    this.searchService.searchTextInBookTermEmitter$.subscribe(res => {
      this.searchInBookTerm = res;
    })

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  savePlace(): void {
    if (this.place.name, this.place.latitude, this.place.longitude) {
      this.loading = true;
      this.fireBaseService.createPlace(this.place).then(data => {
        this.nbToastrService.success("", "Added!!!");
        this.loading = false;
        this.place = new Place();
      }).catch((error) => {
        this.loading = false;
        this.nbToastrService.danger("", error);
      });
    }
    else {
      this.nbToastrService.warning("", "Please, fill the fields");
    }
  }

  saveBook(): void {
    if (this.book.name) {

      if (this.isPlaceExist(this.place)) {
        this.nbToastrService.warning("", "The place exists already");
        return;
      }

      if (!this.isValid()) {
        return;
      }
      this.loading = true;
      this.fireBaseService.createBook(this.book).then(data => {
        this.nbToastrService.success("", "Added!!!");
        this.loading = false;
        this.book = new Book();
      }).catch((error) => {
        this.loading = false;
        this.nbToastrService.danger("", error);
      });
    }
    else {
      this.nbToastrService.warning("", "Please, fill the fields");
    }
  }

  isValid(): boolean {
    let result = true;
    if (!this.place.latitude || !this.place.longitude) {
      this.nbToastrService.warning("", "Please enter coordinates");
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
    this.fireBaseService.getPlaces().subscribe(data => {
      this.places = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Place;
      })
    });
  }

  updatePlace(): void {

    if (this.isValid()) {
      this.loading = true;
      this.fireBaseService.updatePlace(this.place).then(() => {
        this.nbToastrService.success("", "Updated");
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
        console.error(error);
        this.nbToastrService.danger("", "Error")
      })
    }
  }

  updateBook(): void {

    if (true) {
      this.fireBaseService.updateBook(this.book).then(() => {
        this.nbToastrService.success("", "Updated");
      }).catch((error) => {
        console.error(error);
        this.nbToastrService.danger("", "Error")
      })
    }
  }

  private isPlaceExist(place: Place): boolean {
    return this.places.filter(el => el.name === place.name).length > 0;
  }

  getBooks(): void {
    this.fireBaseService.getBooks().subscribe(data => {
      this.books = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } as Book;
      })
      this.book = this.books[0];
    });
  }

  tabChanged(event): void {
    if (event.tabTitle === "Place") {
      this.isPlaceTab = true;
    }
    else {
      this.isPlaceTab = false;
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
        this.nbToastrService.success("", "Deleted");
      }).catch(err => console.error(err))
    }
  }

  handleFileSelect(evt) {
    this.filesToUpload
    let files = evt.target.files;

    if (!files.length) {
      this.nbToastrService.warning("", "Please select image");
      return;
    }

    Object.keys(files).forEach(key => {

      const file = files[key];

      let sizeKb = file.size / 1024;

      if (sizeKb > 500) {
        this.filesToUpload = null;
        this.nbToastrService.warning("", `File ${file.name} too big`);
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
    var binaryString = readerEvt.target.result;
    let base64textString = btoa(binaryString);
    if (base64textString) {
      if (this.place.images.length >= this.maxNumberOfImages) {
        this.nbToastrService.warning("", `Maximun number of images is ${this.maxNumberOfImages}`);
        return;
      }
      this.place.images.unshift(base64textString);
      this.nbToastrService.success("", "Image added");
    }
    else {
      this.nbToastrService.warning("", "Error loading image");
    }
  }

  deleteFromImageArray(index: number): void {
    this.place.images.splice(index, 1);
  }



}

