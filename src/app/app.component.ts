import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { NbSidebarService, NbThemeService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { Place } from './shared/models/coordinates';
import { FireBaseService } from './shared/services/fire-base.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  display;
  title = 'map';
  sideBarState = 'collapsed';
  plases$: Observable<Place>;
  constructor(
    private router: Router,
    private sidebarService: NbSidebarService,
    private fireBaseService: FireBaseService,
    private themeService: NbThemeService
  ) {

  }
  ngOnInit() {
    this.plases$ = this.fireBaseService.getPlaces();
  }
  navigateTo(path): void {
    this.router.navigate([path]);
  }
  toggle() {
    this.sidebarService.toggle();
  }
  changeTheme(event): void {
    this.themeService.changeTheme(event);
  }
}
