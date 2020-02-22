import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarModule } from 'primeng/sidebar';
import { AgmCoreModule } from '@agm/core';
import { GoogleMapComponent } from './ui-components/google-map/google-map.component';
import { FormsModule } from '@angular/forms';
import { NbThemeModule, NbLayoutModule, NbButtonModule, NbAccordionModule, NbCardModule, NbSidebarModule, NbInputModule, NbToastrModule, NbSelectModule, NbListModule, NbContextMenuModule, NbMenuModule, NbTabsetModule, NbTooltipModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { SidebarComponent } from './ui-components/sidebar/sidebar.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AdminComponent } from './ui-components/admin/admin.component';
import { HomeComponent } from './ui-components/home/home.component';
import { BookComponent } from './ui-components/book/book.component';
import { SearchBookPipe } from './shared/pipe/book-search-pipe';
import { BookTextConcaterPipe } from './shared/pipe/book-text-pipe';
import { TextFormatPipe } from './shared/pipe/text-format-pipe';
import { ColorTextSearchPipe } from './shared/pipe/color-text-search-pipe';

@NgModule({
  declarations: [
    AppComponent,
    GoogleMapComponent,
    SidebarComponent,
    AdminComponent,
    HomeComponent,
    BookComponent,
    SearchBookPipe,
    BookTextConcaterPipe,
    TextFormatPipe,
    ColorTextSearchPipe

  ],
  imports: [
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
    NbToastrModule.forRoot(),
    NbMenuModule.forRoot(),
    NbButtonModule,
    NbAccordionModule,
    NbLayoutModule,
    NbEvaIconsModule,
    NbInputModule,
    NbSelectModule,
    NbListModule,
    NbContextMenuModule,
    NbTabsetModule,
    NbTooltipModule,
    // firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
