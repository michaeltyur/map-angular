import { Component, OnInit } from '@angular/core';
import { MapNavigationService } from 'src/app/shared/services/map-navigation.service';
import { Place } from 'src/app/shared/models/coordinates';
import { FireBaseService } from 'src/app/shared/services/fire-base.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  places: Place[] = [];
  constructor(
    private mapNavigationService: MapNavigationService,
    private fireBaseService: FireBaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    //this.places = Places;
    this.getPlaces();
  }

  mapNavigateTo(place: Place): void {
    if (!window.location.href.match("google-map")) {
      this.router.navigate(["/google-map",place.latitude,place.longitude]).then(() => {
        this.mapNavigationService.mapNavigateTo(place);
      })
    }
    else {
      this.mapNavigationService.mapNavigateTo(place);
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
