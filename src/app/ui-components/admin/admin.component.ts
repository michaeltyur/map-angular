import { Component, OnInit } from '@angular/core';
import { Place } from 'src/app/shared/models/coordinates';
import { FireBaseService } from 'src/app/shared/services/fire-base.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  place:Place;

  constructor(
    private fireBaseService:FireBaseService,
    private nbToastrService:NbToastrService
    ) {
    this.place = new Place();
   }

  ngOnInit(): void {
  }
  save():void{
    if (this.place.name,this.place.latitude,this.place.longitude) {
      this.fireBaseService.createPlace(this.place).then(data=>{
        this.nbToastrService.success("","Added!!!");
        this.place = new Place();
      });
    }
    else{
      this.nbToastrService.warning("","Please, fill the fields");
    }

  }

}
