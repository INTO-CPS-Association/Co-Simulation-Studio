import { Component, Input, OnInit } from '@angular/core';
import { DefaultButton } from '@fluentui/react';
import { Subject, Subscription } from 'rxjs';
import { MaestroApiService, maestroVersions } from 'src/app/modules/shared/services/maestro-api.service';


@Component({
  selector: 'app-coe-launch',
  templateUrl: './coe-launch.component.html',
  styleUrls: ['./coe-launch.component.scss']
})
export class CoeLaunchComponent {

  defaultButton = DefaultButton;
  defaultButtonProps = {
    text: "Launch",
    onClick: () => {
      this.onCoeLaunchClick();
    },
    iconProps: { iconName: 'Play' },
    allowDisabledFocus: true,
    disabled: false
  }

  //FIXME is non-angular interface 
  _coeIsOnlineSub: Subscription;
  online: boolean = false;
  correctCoeVersion: boolean = true;
  //FIXME is non-angular interface 
  coeVersions = maestroVersions;

  //FIXME is non-angular interface 
  @Input()
  required_coe_version!: maestroVersions;

  //FIXME is non-angular interface 
  @Input()
  coeLaunchClick!: Subject<void>;

  //FIXME is non-angular interface 
  constructor(public coeSimulationService: MaestroApiService) {
    this._coeIsOnlineSub = coeSimulationService.startMonitoringOnlineStatus(isOnline => {
      if (this.required_coe_version) {
        this.correctCoeVersion = this.required_coe_version == coeSimulationService.getMaestroVersion();
      }
      this.online = isOnline;
    });
  }

  //FIXME is non-angular interface 
  ngOnDestroy(): void {
    this.coeSimulationService.stopMonitoringOnlineStatus(this._coeIsOnlineSub);
  }
//FIXME is non-angular interface 
  onCoeLaunchClick() {
    if (this.coeLaunchClick) {
      this.coeLaunchClick.next();
    }
    this.coeSimulationService.launchCOE();
  }

}
