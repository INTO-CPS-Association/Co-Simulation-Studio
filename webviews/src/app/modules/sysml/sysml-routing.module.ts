import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SysmlDseExportComponent } from './components/sysml-dse-export/sysml-dse-export.component';
import { SysmlExportComponent } from './components/sysml-export/sysml-export.component';

const routes: Routes = [
  {
    path: "sysml-dse-export",
    component: SysmlDseExportComponent
  },
  {
    path: "sysml-export",
    component: SysmlExportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SysmlRoutingModule { }
