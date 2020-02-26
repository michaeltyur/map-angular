import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MapNavigationService } from 'src/app/shared/services/map-navigation.service';
import { FireBaseService } from 'src/app/shared/services/fire-base.service';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/shared/services/search.service';
import { NbSidebarService } from '@nebular/theme';
import { Place, PlaceImages } from 'src/app/shared/models/firebase-collection-models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  subscription = new Subscription();
  places: Place[] = [];
  place: Place;
  placeDetail: Place;
  placeImages: PlaceImages;

  @Input() placeSearchTerm: string = "";
  @Input() bookSearchTerm: string = "";

  constructor(
    private mapNavigationService: MapNavigationService,
    private fireBaseService: FireBaseService,
    private router: Router,
    private searchService: SearchService,
    private sidebarService: NbSidebarService
  ) { }

  ngOnInit(): void {
    //this.places = Places;
    this.getPlaces();
    this.subscription.add(this.searchService.placeDetailsEmitter$.subscribe(data => {
      this.place = data;
    }));

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  mapNavigateTo(place: Place): void {
    if (!window.location.href.match("google-map")) {
      this.router.navigate(["/google-map", place.latitude, place.longitude]).then(() => {
        this.mapNavigationService.mapNavigateTo(place);
      })
    }
    else {
      this.mapNavigationService.mapNavigateTo(place);
    }
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
  collapsedChange(item: Place): void {
    //this.getPlaceImages(this.place.id);
    this.searchService.sideBarSelectItemEmitter$.emit(item);
  }
  openDetails(place: Place): void {
    this.getPlaceImages(place.id);
    this.sidebarService.collapse();
    this.place = place;
    this.sidebarService.expand();
  }

  getPlaceImages(docID: string): void {
    this.subscription.add(this.fireBaseService.getPlaceImagesByDocID(docID).subscribe(data => {
      this.placeImages = data;
    }));

  }

}
