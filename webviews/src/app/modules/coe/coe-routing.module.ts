import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveGraph } from '../shared/classes/co-simulation-config';
import { BoundedDifferenceComponent } from './components/bounded-difference/bounded-difference.component';
import { CoeConfigurationComponent } from './components/coe-configuration/coe-configuration.component';
import { CoeLaunchComponent } from './components/coe-launch/coe-launch.component';
import { CoePageComponent } from './components/coe-page/coe-page.component';
import { CoeServerStatusComponent } from './components/coe-server-status/coe-server-status.component';
import { CoeSimulationComponent } from './components/coe-simulation/coe-simulation.component';
import { FmuMaxStepSizeComponent } from './components/fmu-max-step-size/fmu-max-step-size.component';
import { GraphComponent } from './components/graph/graph.component';
import { LiveGraphComponent } from './components/live-graph/live-graph.component';
import { SamplingRateComponent } from './components/sampling-rate/sampling-rate.component';
import { ZeroCrossingComponent } from './components/zero-crossing/zero-crossing.component';

const routes: Routes = [
  {
    path: "",
    component: CoePageComponent
  },
  {
    path: "bounded-difference",
    component: BoundedDifferenceComponent
  },
  {
    path: "coe-configuration",
    component: CoeConfigurationComponent
  },
  {
    path: "coe-launch",
    component: CoeLaunchComponent
  },
  {
    path: "coe-server-status",
    component: CoeServerStatusComponent
  },
  {
    path: "coe-simulation",
    component: CoeSimulationComponent
  },
  {
    path: "fmu-max-step-size",
    component: FmuMaxStepSizeComponent
  },
  {
    path: "graph",
    component: GraphComponent
  },
  {
    path: "live-graph",
    component: LiveGraphComponent
  },
  {
    path: "sampling-rate",
    component: SamplingRateComponent
  },
  {
    path: "zero-crossing",
    component: ZeroCrossingComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoeRoutingModule { }
