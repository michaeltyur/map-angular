import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Place } from 'src/app/shared/models/coordinates';
import { DomSanitizer } from '@angular/platform-browser';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.scss']
})
export class PlaceDetailComponent implements OnInit {

  @Input() place: Place;
  imageNotAvalibleSrc = "/assets/photo/no-image.png";
  frontImagePath: string;
  selectedImageIndex: number = 0;

  constructor(
    private sanitizer: DomSanitizer,
    private dialogService: NbDialogService) { }

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

  imageLoadError(event): void {
    event.target.src = this.imageNotAvalibleSrc;
  }

  openImageWindow(place: Place, index: number, dialog: TemplateRef<any>): void {
    let dialogRef = this.dialogService.open(dialog, { context: place });
    this.selectedImageIndex = index;
    this.frontImagePath = place.images[this.selectedImageIndex];
  }
  sliceRight(): void {
    this.selectedImageIndex++;
    if (this.selectedImageIndex >= this.place.images.length) {
      this.selectedImageIndex = 0;
    }
    this.frontImagePath = this.place.images[this.selectedImageIndex];
  }
  sliceLeft(): void {
    this.selectedImageIndex--;
    if (this.selectedImageIndex < 0) {
      this.selectedImageIndex = this.place.images.length - 1;
    }
    this.frontImagePath = this.place.images[this.selectedImageIndex];
  }

}
