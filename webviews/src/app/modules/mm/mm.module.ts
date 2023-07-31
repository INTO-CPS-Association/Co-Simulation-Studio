import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MmRoutingModule } from './mm-routing.module';
import { MmConfigurationComponent } from './components/mm-configuration/mm-configuration.component';
import { MmOverviewComponent } from './components/mm-overview/mm-overview.component';
import { MmPageComponent } from './components/mm-page/mm-page.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MmConfigurationComponent,
    MmOverviewComponent,
    MmPageComponent
  ],
  imports: [
    CommonModule,
    MmRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    MmPageComponent
  ]
})
export class MmModule { }
