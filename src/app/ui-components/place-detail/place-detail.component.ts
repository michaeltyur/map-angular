import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbDialogService } from '@nebular/theme';
import { Place, PlaceImages } from 'src/app/shared/models/firebase-collection-models';
import { FireBaseService } from 'src/app/shared/services/fire-base.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.scss']
})
export class PlaceDetailComponent implements OnInit {

  @Input() place: Place;
  @Input() placeImages: PlaceImages ;
  imageNotAvalibleSrc = "/assets/photo/no-image.png";
  frontImagePath: string;
  selectedImageIndex: number = 0;

  constructor(
    private sanitizer: DomSanitizer,
    private dialogService: NbDialogService,
    private fireBaseService: FireBaseService) { }

  ngOnInit(): void {
    // this.getPlaceImages(this.place.id);
  }

  // getPlaceImages(docID: string): void {
  //   this.fireBaseService.getPlaceImagesByDocID(docID).subscribe(data => {
  //     this.placeImages = data;
  //   })
  // }

  imageLoadError(event): void {
    event.target.src = this.imageNotAvalibleSrc;
  }

  openImageWindow(place: Place, index: number, dialog: TemplateRef<any>): void {
    let dialogRef = this.dialogService.open(dialog, { context: place });
    this.selectedImageIndex = index;
    this.frontImagePath = this.placeImages.images[this.selectedImageIndex];
  }
  sliceRight(): void {
    this.selectedImageIndex++;
    if (this.selectedImageIndex >= this.placeImages.images.length) {
      this.selectedImageIndex = 0;
    }
    this.frontImagePath = this.placeImages.images[this.selectedImageIndex];
  }
  sliceLeft(): void {
    this.selectedImageIndex--;
    if (this.selectedImageIndex < 0) {
      this.selectedImageIndex = this.placeImages.images.length - 1;
    }
    this.frontImagePath = this.placeImages.images[this.selectedImageIndex];
  }

}
