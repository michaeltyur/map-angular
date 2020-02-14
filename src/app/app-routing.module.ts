import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminComponent } from './ui-components/admin/admin.component';
import { GoogleMapComponent } from './ui-components/google-map/google-map.component';


const routes: Routes = [
  { path: 'google-map', component: GoogleMapComponent },
  { path: 'admin', component: AdminComponent },
  {path: '', redirectTo: '/google-map', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
