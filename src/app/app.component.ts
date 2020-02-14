import { Component } from '@angular/core';
import {MenuItem} from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  display;
  title = 'map';
  constructor(private router:Router){

  }
  navigateTo(path):void{
  this.router.navigate([path]);
  }
}
