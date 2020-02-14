import { Component, OnInit } from '@angular/core';
import { Place, Places } from 'src/app/models/coordinates';
import { MapNavigationService } from 'src/app/models/services/map-navigation.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  places: Place[] = [];
  constructor(
    private mapNavigationService:MapNavigationService
    ) { }

  ngOnInit(): void {
    this.places = Places;
  }

  mapNavigateTo(place:Place):void{
    this.mapNavigationService.mapNavigateTo(place);
  }

}
