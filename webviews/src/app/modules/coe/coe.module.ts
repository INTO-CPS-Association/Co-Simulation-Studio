import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CoeRoutingModule } from './coe-routing.module';
import { GraphComponent } from './components/graph/graph.component';
import { ZeroCrossingComponent } from './components/zero-crossing/zero-crossing.component';
import { SamplingRateComponent } from './components/sampling-rate/sampling-rate.component';
import { LiveGraphComponent } from './components/live-graph/live-graph.component';
import { FmuMaxStepSizeComponent } from './components/fmu-max-step-size/fmu-max-step-size.component';
import { BoundedDifferenceComponent } from './components/bounded-difference/bounded-difference.component';
import { CoeConfigurationComponent } from './components/coe-configuration/coe-configuration.component';
import { CoeSimulationComponent } from './components/coe-simulation/coe-simulation.component';
import { CoePageComponent } from './components/coe-page/coe-page.component';
import { CoeLaunchComponent } from './components/coe-launch/coe-launch.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoeServerStatusComponent } from './components/coe-server-status/coe-server-status.component';
import { Graph } from '../shared/classes/graph';

@NgModule({
  declarations: [
    GraphComponent,
    ZeroCrossingComponent,
    SamplingRateComponent,
    LiveGraphComponent,
    FmuMaxStepSizeComponent,
    BoundedDifferenceComponent,
    CoeConfigurationComponent,
    CoeSimulationComponent,
    CoePageComponent,
    CoeLaunchComponent,
    CoeServerStatusComponent
  ],
  imports: [
    CommonModule,
    CoeRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    BoundedDifferenceComponent,
    CoeConfigurationComponent,
    CoeLaunchComponent,
    CoePageComponent,
    CoeServerStatusComponent,
    CoeSimulationComponent,
    FmuMaxStepSizeComponent,
    GraphComponent,
    LiveGraphComponent,
    SamplingRateComponent,
    ZeroCrossingComponent
  ]
})
export class CoeModule { }
