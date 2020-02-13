import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {
  latitude = 32.183894;
  longitude = 34.871544;
  mapType = 'roadmap';
  zoom = 14;
  constructor() { }

  ngOnInit(): void {
  }

}
export enum MapTypeIdEnum{
  HYBRID='hybrid',
  ROADMAP = 'ROADMAP',
  SATELLITE = 'SATELLITE',
  TERRAIN = 'TERRAIN'
}
