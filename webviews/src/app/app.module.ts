import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { CoeModule } from './modules/coe/coe.module';
import { DseModule } from './modules/dse/dse.module';
import { MmModule } from './modules/mm/mm.module';
import { SharedModule } from './modules/shared/shared.module';
import { ReactExampleComponent } from './react-example/react-example.component';

import { initializeIcons } from '@fluentui/react/lib/Icons';

initializeIcons();

@NgModule({
  declarations: [
    AppComponent,
    ReactExampleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    CoeModule,
    DseModule,
    MmModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
