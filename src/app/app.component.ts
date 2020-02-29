import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { NbSidebarService, NbThemeService, NbMenuService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { FireBaseService } from './shared/services/fire-base.service';
import { SearchService } from './shared/services/search.service';
import { Place } from './shared/models/firebase-collection-models';
import { DeviceDetectorService } from 'ngx-device-detector';
import { filter, map } from 'rxjs/operators';
import { AspService } from './shared/services/asp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  display;
  title = 'map';
  placeSearchTerm: string = "";
  bookSearchTerm: string = "";
  isSideBarCollapsed:boolean = false;
  isMobile:boolean ;
  plases$: Observable<Place>;
  themeMenuItems = [{ title:  'default' }, { title: 'corporate' },{ title: 'dark' }, { title: 'cosmic' }];
  constructor(
    private router: Router,
    private sidebarService: NbSidebarService,
    private fireBaseService: FireBaseService,
    private themeService: NbThemeService,
    private searchService:SearchService,
    private nbMenuService:NbMenuService,
    private deviceService: DeviceDetectorService,
    private aspService: AspService
  ) {
    sidebarService.expand();
  }
  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
    this.plases$ = this.fireBaseService.getPlaces();
    this.searchService.placeDetailsEmitter$.subscribe((data)=>{
      if (data) {
        this.isSideBarCollapsed = false;
      }
    })

    this.nbMenuService.onItemClick()
    .pipe(
      filter(({ tag }) => tag === 'theme-context-menu'),
      map(({ item: { title } }) => title)).subscribe((title)=>this.changeTheme(title))

    this.sidebarService.onCollapse().subscribe(()=>this.isSideBarCollapsed = true)
    this.sidebarService.onExpand().subscribe(()=>this.isSideBarCollapsed = false)
  }
  navigateTo(path): void {
    this.router.navigate([path]);
  }
  toggle() {
    this.sidebarService.toggle();
  }
  collapseSideBar() {
    this.sidebarService.collapse();
    this.isSideBarCollapsed = true;
  }
  expandSideBar() {
    this.sidebarService.expand();
    this.isSideBarCollapsed = false;
  }
  changeTheme(event): void {
    this.themeService.changeTheme(event);
  }
  placeSearchInput():void{
    this.sidebarService.expand();
  }
  bookSearchInput():void{
    this.searchService.searchTextInBookTermEmitter$.emit(this.bookSearchTerm);
  }
  fireBaseAction():void{
    this.fireBaseService.actionWithFireBase();
  }
}
