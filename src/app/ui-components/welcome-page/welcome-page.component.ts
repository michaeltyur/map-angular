import { Component, OnInit, OnDestroy } from '@angular/core';
import { AspService } from 'src/app/shared/services/asp.service';
import { NbSidebarService } from '@nebular/theme';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/shared/services/search.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { PlaceImages } from 'src/app/shared/models/firebase-collection-models';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit, OnDestroy {

  placeImages: PlaceImages[] = [];
  interval;
  isMobile: boolean;
  welcomeTitle: string = "Добро пожаловать на историко-литературный сайт";
  constructor(
    private aspService: AspService,
    private sidebarService: NbSidebarService,
    private router: Router,
    private searchService: SearchService,
    private deviceService: DeviceDetectorService
  ) {
  }

  ngOnInit(): void {

    this.isMobile = this.deviceService.isMobile();
    if(this.isMobile){
      this.welcomeTitle = "Добро пожаловать";
    }

    this.sidebarService.collapse();
    this.searchService.isLayoutHeaderVisibleEmitter$.emit(false);
    this.getRandomPlaceImages();
    this.interval = setInterval(() => {
      this.getRandomPlaceImages();
    }, 8000);
  }
  ngOnDestroy(): void {
    this.searchService.isLayoutHeaderVisibleEmitter$.emit(true);
    clearInterval(this.interval);
  }

  getRandomPlaceImages(): void {
    this.aspService.getRandomPlaceImages().subscribe((res: PlaceImages[]) => {
      if (res && res.length) {
        if (!this.placeImages.length) {
          this.placeImages = res;
        }
        else {
          this.changeImagesContent(res);
        }

      }
    })
  }

  changeImagesContent(res: PlaceImages[]): void {

    for (let index = 0; index < this.placeImages.length; index++) {

      this.placeImages[index].fileName = res[index].fileName;
      this.placeImages[index].imagePath = res[index].imagePath;
      this.placeImages[index].name = res[index].name;
      this.placeImages[index].placeImagesID = res[index].placeImagesID;
    }

  }
  navigateTo(path): void {
    this.router.navigate([path]);
  }

}
