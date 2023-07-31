import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigverCoeInteractionComponent } from './components/sigver-coe-interaction/sigver-coe-interaction.component';
import { SigverConfigurationComponent } from './components/sigver-configuration/sigver-configuration.component';
import { SigverPageComponent } from './components/sigver-page/sigver-page.component';

const routes: Routes = [
  {
    path: "",
    component: SigverPageComponent
  },
  {
    path: "sigver-coe-interaction",
    component: SigverCoeInteractionComponent
  },
  {
    path: "sigver-interaction",
    component: SigverConfigurationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SigverRoutingModule { }
