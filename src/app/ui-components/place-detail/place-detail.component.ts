import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbDialogService } from '@nebular/theme';
import { Place, PlaceImages } from 'src/app/shared/models/firebase-collection-models';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.component.html',
  styleUrls: ['./place-detail.component.scss']
})
export class PlaceDetailComponent implements OnInit {

  @Input() place: Place;
  @Input() placeImagesArray: PlaceImages[] ;
  imageNotAvalibleSrc = "https://live-project.space/Images/PlaceBookImages/no-image.png";
  frontImagePath: string;
  selectedImageIndex: number = 0;

  constructor(
    private sanitizer: DomSanitizer,
    private dialogService: NbDialogService) { }

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

  openImageWindow(image : PlaceImages, index: number, dialog: TemplateRef<any>): void {
    let dialogRef = this.dialogService.open(dialog, { context: image });
    this.selectedImageIndex = index;
    this.frontImagePath = image.imagePath;
  }
  sliceRight(): void {
    this.selectedImageIndex++;

    if (this.selectedImageIndex >= this.placeImagesArray.length) {
      this.selectedImageIndex = 0;
    }
   this.frontImagePath = this.placeImagesArray[this.selectedImageIndex].imagePath;
  }
  sliceLeft(): void {
    this.selectedImageIndex--;
    if (this.selectedImageIndex < 0) {
      this.selectedImageIndex = this.placeImagesArray.length - 1;
    }
    this.frontImagePath = this.placeImagesArray[this.selectedImageIndex].imagePath;
  }

}
