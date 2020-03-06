import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapNavigationService } from 'src/app/shared/services/map-navigation.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import { NbSidebarService } from '@nebular/theme';
import { SearchService } from 'src/app/shared/services/search.service';
import { Place } from 'src/app/shared/models/firebase-collection-models';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  places: Place[] = [];
  latitude = 62.0833;
  longitude = 35.2148;
  mapType = 'hybrid';
  zoom = 8;
  isMobile: boolean;
  constructor(
    private mapNavigationService: MapNavigationService,
    private route: ActivatedRoute,
    private sidebarService: NbSidebarService,
    private searchService: SearchService,
    private deviceService: DeviceDetectorService,
  ) { }

  ngOnInit(): void {

    this.isMobile = this.deviceService.isMobile();
    if (!this.isMobile) {
      this.sidebarService.expand();
    }
    else {
      this.sidebarService.collapse();
    }

    this.searchService.placeDetailsEmitter$.emit(null);

    this.subscription.add(this.mapNavigationService.coordinatEmitter$.subscribe((res: Place) => {
      this.latitude = +res.latitude;
      this.longitude = +res.longitude;

      this.zoom = res.zoom ? res.zoom : this.zoom;
    }));


    this.latitude = +this.route.snapshot.paramMap.get('latitude') ? +this.route.snapshot.paramMap.get('latitude') : this.latitude;
    this.longitude = +this.route.snapshot.paramMap.get('longitude') ? +this.route.snapshot.paramMap.get('longitude') : this.longitude;
    //this.sidebarService.expand();

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  toggle() {
    this.sidebarService.toggle();
  }

  onMouseOver(infoWindow, $event: MouseEvent) {
    infoWindow.open();
  }

  onMouseOut(infoWindow, $event: MouseEvent) {
    infoWindow.close();
  }

  onMapMarkerClick(place: Place): void {
    this.sidebarService.collapse();
    this.searchService.placeDetailsEmitter$.emit(place);
    this.sidebarService.expand();
  }

}

