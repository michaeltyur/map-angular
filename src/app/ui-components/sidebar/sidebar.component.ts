import { Component, OnInit, Input } from '@angular/core';
import { MapNavigationService } from 'src/app/shared/services/map-navigation.service';
import { Place } from 'src/app/shared/models/coordinates';
import { FireBaseService } from 'src/app/shared/services/fire-base.service';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/shared/services/search.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  places: Place[] = [];
  @Input() placeSearchTerm: string = "";
  @Input() bookSearchTerm: string = "";

  constructor(
    private mapNavigationService: MapNavigationService,
    private fireBaseService: FireBaseService,
    private router: Router,
    private searchService: SearchService
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
  collapsedChange(item:Place):void{
    this. searchService.sideBarSelectItemEmitter$.emit(item);
  }
}
