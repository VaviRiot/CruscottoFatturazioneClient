import { AgmCoreModule } from '@agm/core';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';

import { NgxSpinnerModule } from "ngx-spinner";
import { AlertModule } from 'ngx-alerts';

import { registerLocaleData } from '@angular/common';
import localeIT from '@angular/common/locales/it';
import { SharedModule } from './shared/shared.module';
import { locale } from 'moment';
import { MAT_DATE_LOCALE } from '@angular/material/core';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    NgxSpinnerModule,
    SharedModule.forRoot(),
    AlertModule.forRoot({ maxMessages: 5, timeout: 5000, positionX: 'right', positionY: 'top' }),
    AgmCoreModule.forRoot({
      apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    LoginComponent,
    AdminLayoutComponent
   ],
  providers: [{
                provide: LOCALE_ID,
                useValue: 'it-IT'
              },
              { provide: MAT_DATE_LOCALE, useValue: 'it-IT' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor()
  {
    registerLocaleData(localeIT);
    locale('it');
  }
 }
