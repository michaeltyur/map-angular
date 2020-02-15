import { Component, OnInit, Inject } from '@angular/core';
import { Place } from 'src/app/shared/models/coordinates';
import { FireBaseService } from 'src/app/shared/services/fire-base.service';
import { NbToastrService, NbMenuService, NB_WINDOW } from '@nebular/theme';
import { filter,map } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  place: Place;
  places: Place[];
  placeFiltred: Place;
  searchTerm:string;
  placesFiltred: NbContextMenuItem[] = [{title : ""}] ;
  searchStatus: string = "basic";

  constructor(
    private fireBaseService: FireBaseService,
    private nbToastrService: NbToastrService,
    private nbMenuService: NbMenuService,
    @Inject(NB_WINDOW) private window
  ) {
    this.place = new Place();
  }

  ngOnInit(): void {
    this.getPlaces();

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

  save(): void {
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


}

export class NbContextMenuItem {
  title: string;
  constructor(title: string) {
    this.title = title;
  }
}
