import { Component, OnInit } from '@angular/core';
import { MapNavigationService } from 'src/app/shared/services/map-navigation.service';
import { Place } from 'src/app/shared/models/coordinates';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import { NbSidebarService } from '@nebular/theme';
import { FireBaseService } from 'src/app/shared/services/fire-base.service';
import { SearchService } from 'src/app/shared/services/search.service';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {
  places: Place[] = [];
  latitude = 62.0833;
  longitude = 35.2148;
  mapType = 'hybrid';
  zoom = 8;
  constructor(
    private fireBaseService: FireBaseService,
    private mapNavigationService: MapNavigationService,
    private route: ActivatedRoute,
    private sidebarService: NbSidebarService,
    private searchService:SearchService
  ) { }

  ngOnInit(): void {
    this.sidebarService.expand();
    if (this.fireBaseService.places.length) {
      this.places = this.fireBaseService.places
    }
    else {
      this.getPlaces();
    }

    this.searchService.placeDetailsEmitter$.emit(null);

    this.mapNavigationService.coordinatEmitter$.subscribe((res: Place) => {
      this.latitude = +res.latitude;
      this.longitude = +res.longitude;

      this.zoom = res.zoom ? res.zoom : this.zoom;
    })

    this.latitude = +this.route.snapshot.paramMap.get('latitude') ? +this.route.snapshot.paramMap.get('latitude') : this.latitude;
    this.longitude = +this.route.snapshot.paramMap.get('longitude') ? +this.route.snapshot.paramMap.get('longitude') : this.longitude;
    this.sidebarService.expand();

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

  toggle() {
    this.sidebarService.toggle();
  }

onMouseOver(infoWindow, $event: MouseEvent) {
    infoWindow.open();
}

onMouseOut(infoWindow, $event: MouseEvent) {
    infoWindow.close();
}

onMapMarkerClick(place:Place):void{
  this.sidebarService.collapse();
  this.searchService.placeDetailsEmitter$.emit(place);
  this.sidebarService.expand();
}

}

