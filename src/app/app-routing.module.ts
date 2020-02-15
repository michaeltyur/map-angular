import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AdminComponent } from './ui-components/admin/admin.component';
import { GoogleMapComponent } from './ui-components/google-map/google-map.component';
import { HomeComponent } from './ui-components/home/home.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'google-map', component: GoogleMapComponent },
  { path: 'admin', component: AdminComponent },
  {path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
