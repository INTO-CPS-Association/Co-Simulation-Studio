import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SigverRoutingModule } from './sigver-routing.module';
import { SigverCoeInteractionComponent } from './components/sigver-coe-interaction/sigver-coe-interaction.component';
import { SigverConfigurationComponent } from './components/sigver-configuration/sigver-configuration.component';
import { SigverPageComponent } from './components/sigver-page/sigver-page.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CoeModule } from '../coe/coe.module';


@NgModule({
  declarations: [
    SigverCoeInteractionComponent,
    SigverConfigurationComponent,
    SigverPageComponent
  ],
  imports: [
    CommonModule,
    SigverRoutingModule,
    FormsModule,
    SharedModule,
    CoeModule
  ]
})
export class SigverModule { }
