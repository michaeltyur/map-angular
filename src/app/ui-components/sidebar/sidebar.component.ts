import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { MapNavigationService } from 'src/app/shared/services/map-navigation.service';
import { FireBaseService } from 'src/app/shared/services/fire-base.service';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/shared/services/search.service';
import { NbSidebarService } from '@nebular/theme';
import { Place, PlaceImages } from 'src/app/shared/models/firebase-collection-models';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AspService } from 'src/app/shared/services/asp.service';
import { CrudService } from 'src/app/shared/services/crud.service';

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
  placeImagesArray: PlaceImages[];
  isMobile: boolean;
  @Input() placeSearchTerm: string = "";
  @Input() bookSearchTerm: string = "";

  constructor(
    private mapNavigationService: MapNavigationService,
    // private fireBaseService: FireBaseService,
    private router: Router,
    private searchService: SearchService,
    private sidebarService: NbSidebarService,
    private deviceService: DeviceDetectorService,
    private aspService: AspService,
    private crudService: CrudService
  ) { }

  ngOnInit(): void {
    this.isMobile = this.deviceService.isMobile();
    if (!this.isMobile) {
      this.sidebarService.expand();
    }
    else {
      this.sidebarService.collapse();
    }
    this.emitterSubscribtions();
    this.getPlaces();
  }

  emitterSubscribtions(): void {
    // Place Updated
    this.subscription.add(this.crudService.updatePlaceEmitter$.subscribe((place: Place) => {
      this.places.filter(el => el.placeID === place.placeID)[0] = place;
    }));

    //Place Added
    this.subscription.add(this.crudService.newPlaceAddedEmitter$.subscribe((place: Place) => {
      this.places.unshift(place);
    }));

    //Place Details
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
    this.subscription.add(this.aspService.getAllPlaces().subscribe((places: Place[]) => {
      if (places) {
        this.places = places;
      }
    }));
  }

  collapsedChange(item: Place): void {
    this.searchService.sideBarSelectItemEmitter$.emit(item);
  }
  openDetails(place: Place): void {
    this.getPlaceImages(place.placeID);
    this.sidebarService.collapse();
    this.place = place;
    this.sidebarService.expand();
  }

  getPlaceImages(id: number): void {
    this.subscription.add(this.aspService.getPlaceImagesByParentID(id).subscribe((res: PlaceImages[]) => {
      if (res) {
        this.placeImagesArray = res;
      }
    }));
  }

  closeDetails():void{
    if(this.isMobile){
      this.sidebarService.collapse();
    }
    this.place = null;
  }

}
