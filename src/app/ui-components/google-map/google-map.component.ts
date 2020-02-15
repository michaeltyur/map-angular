import { Component, OnInit } from '@angular/core';
import { MapNavigationService } from 'src/app/shared/services/map-navigation.service';
import { Place } from 'src/app/shared/models/coordinates';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {
  latitude = 32.183894;
  longitude = 34.871544;
  mapType = 'hybrid';
  zoom = 13;
  constructor(
    private mapNavigationService: MapNavigationService
  ) { }

  ngOnInit(): void {
    this.mapNavigationService.coordinatEmitter$.subscribe((res: Place) => {
      this.latitude = +res.latitude;
      this.longitude = +res.longitude;

      this.zoom = res.zoom ? res.zoom : this.zoom;
    })
  }

}

