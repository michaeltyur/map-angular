import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SidebarModule} from 'primeng/sidebar';
import { AgmCoreModule } from '@agm/core';
import { GoogleMapComponent } from './ui-components/google-map/google-map.component';
import { FormsModule } from '@angular/forms';
import { NbThemeModule, NbLayoutModule, NbButtonModule, NbAccordionModule, NbCardModule, NbSidebarModule, NbInputModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { SidebarComponent } from './ui-components/sidebar/sidebar.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { AdminComponent } from './ui-components/admin/admin.component';


@NgModule({
  declarations: [
    AppComponent,
    GoogleMapComponent,
    SidebarComponent,
    AdminComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDvyuhFJ-zjFXFa_JmaHfpURfPnEO9HY8c'
    }),
    NbThemeModule.forRoot({ name: 'cosmic' }),
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    NbCardModule,
    NbSidebarModule.forRoot(),
    NbButtonModule,
    NbAccordionModule,
    NbLayoutModule,
    NbEvaIconsModule,
    NbInputModule
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
