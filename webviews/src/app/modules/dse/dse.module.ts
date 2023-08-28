import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DseRoutingModule } from './dse-routing.module';
import { DseCoeLaunchComponent } from './components/dse-coe-launch/dse-coe-launch.component';
import { DseConfigurationComponent } from './components/dse-configuration/dse-configuration.component';
import { DsePageComponent } from './components/dse-page/dse-page.component';
import { SharedModule } from '../shared/shared.module';
import { CoeModule } from '../coe/coe.module';

@NgModule({
  declarations: [
    DseCoeLaunchComponent,
    DseConfigurationComponent,
    DsePageComponent
  ],
  imports: [
    CommonModule,
    DseRoutingModule,
    FormsModule,
    SharedModule,
    CoeModule
  ],
  exports: [
    DsePageComponent,
    DseConfigurationComponent
  ]
})
export class DseModule { }
