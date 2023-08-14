import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DseConfiguration } from '../shared/classes/dse-configuration';
import { DseCoeLaunchComponent } from './components/dse-coe-launch/dse-coe-launch.component';
import { DseConfigurationComponent } from './components/dse-configuration/dse-configuration.component';
import { DsePageComponent } from './components/dse-page/dse-page.component';

const routes: Routes = [
  {
    path: "",
    component: DsePageComponent
  },
  {
    path: "dse-coe-launch",
    component: DseCoeLaunchComponent
  },
  {
    path: "dse-configuration",
    component: DseConfigurationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DseRoutingModule { }
