import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MmConfigurationComponent } from './components/mm-configuration/mm-configuration.component';
import { MmOverviewComponent } from './components/mm-overview/mm-overview.component';
import { MmPageComponent } from './components/mm-page/mm-page.component';

const routes: Routes = [
  {
    path: "",
    component: MmPageComponent
  },
  {
    path: "mm-configuration",
    component: MmConfigurationComponent
  },
  {
    path: "mm-overview",
    component: MmOverviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MmRoutingModule { }
