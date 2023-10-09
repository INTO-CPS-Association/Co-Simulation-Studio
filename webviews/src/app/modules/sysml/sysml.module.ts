import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SysmlRoutingModule } from './sysml-routing.module';
import { SysmlExportComponent } from './components/sysml-export/sysml-export.component';
import { SysmlDseExportComponent } from './components/sysml-dse-export/sysml-dse-export.component';


@NgModule({
  declarations: [
    SysmlExportComponent,
    SysmlDseExportComponent
  ],
  imports: [
    CommonModule,
    SysmlRoutingModule
  ]
})
export class SysmlModule { }
