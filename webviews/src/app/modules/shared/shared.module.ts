import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { PreviewComponent } from './components/preview/preview.component';
import { OvertureComponent } from './components/overture/overture.component';
import { CheckboxSettingComponent } from './components/checkbox-setting/checkbox-setting.component';
import { SettingTemplateComponent } from './components/setting-template/setting-template.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TextSettingComponent } from './components/text-setting/text-setting.component';
import { ProjectBrowserViewComponent } from './components/project-browser-view/project-browser-view.component';
import { ProjectFetcherComponent } from './components/project-fetcher/project-fetcher.component';
import { ProjectRenameComponent } from './components/project-rename/project-rename.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { FormsModule } from '@angular/forms';
import { PanelComponent } from './components/panel/panel.component';
import { SafePipe } from './pipes/safe.pipe';
import { ReactComponent } from './components/react/react.component';


@NgModule({
  declarations: [
    LineChartComponent,
    PreviewComponent,
    OvertureComponent,
    CheckboxSettingComponent,
    SettingTemplateComponent,
    SettingsComponent,
    TextSettingComponent,
    ProjectBrowserViewComponent,
    ProjectFetcherComponent,
    ProjectRenameComponent,
    TextInputComponent,
    PanelComponent,
    SafePipe,
    ReactComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule
  ],
  exports: [
    LineChartComponent,
    PanelComponent,
    SafePipe,
    ReactComponent
  ]
})
export class SharedModule { }
