import { Component, OnInit, Input } from '@angular/core';
import { Place } from 'src/app/shared/models/coordinates';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.scss']
})
export class PlaceDetailComponent implements OnInit {

  @Input() place: Place;
 imageNotAvalibleSrc="/assets/photo/no-image.png";

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    // if (this.place) {
    //   this.images = this.place.images;
    //   if (window.location.href.includes("localhost")) {
    //    // this.images.map(el =>  this.sanitizer.bypassSecurityTrustStyle('http://localhost:4200' + el.substr(el.indexOf("/assets/"), el.length))
    //    this.images.map(el =>  'http://localhost:4200' + el.substr(el.indexOf("/assets/"), el.length)

    //     )
    //   }
    // }
  }

  imageLoadError(event):void{
    event.target.src = this.imageNotAvalibleSrc;
  }

}
