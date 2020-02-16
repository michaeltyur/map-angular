import { Component, OnInit } from '@angular/core';
import { MapNavigationService } from 'src/app/shared/services/map-navigation.service';
import { Place } from 'src/app/shared/models/coordinates';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import { NbSidebarService } from '@nebular/theme';

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
    private mapNavigationService: MapNavigationService,
    private route: ActivatedRoute,
    private sidebarService: NbSidebarService
  ) { }

  ngOnInit(): void {
  //   this.mapNavigationService.coordinatEmitter$.subscribe((res: Place) => {
  //     this.latitude = +res.latitude;
  //     this.longitude = +res.longitude;

  //     this.zoom = res.zoom ? res.zoom : this.zoom;
  //   })
  // }

  this.latitude = +this.route.snapshot.paramMap.get('latitude');
  this.longitude = +this.route.snapshot.paramMap.get('longitude');
  this.toggle();

}

toggle() {
  this.sidebarService.toggle();
}

}

