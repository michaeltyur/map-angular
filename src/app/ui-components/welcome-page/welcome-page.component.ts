import { Component, OnInit } from '@angular/core';
import { AspService } from 'src/app/shared/services/asp.service';
import { NbSidebarService } from '@nebular/theme';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/shared/services/search.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {

  constructor(
    private aspService: AspService,
    private sidebarService: NbSidebarService,
    private router: Router,
    private searchService: SearchService,
    private deviceService: DeviceDetectorService
  ){
    sidebarService.collapse();
  }

  ngOnInit(): void {
  }

}
