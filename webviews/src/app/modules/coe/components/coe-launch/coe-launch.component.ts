import { Component, Input, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { MaestroApiService, maestroVersions } from 'src/app/modules/shared/services/maestro-api.service';

@Component({
  selector: 'app-coe-launch',
  templateUrl: './coe-launch.component.html',
  styleUrls: ['./coe-launch.component.scss']
})
export class CoeLaunchComponent {

  _coeIsOnlineSub: Subscription;
  online: boolean = false;
  correctCoeVersion: boolean = true;
  coeVersions = maestroVersions;

  @Input()
  required_coe_version!: maestroVersions;

  @Input()
  coeLaunchClick!: Subject<void>;

  constructor(public coeSimulationService: MaestroApiService) {
    this._coeIsOnlineSub = coeSimulationService.startMonitoringOnlineStatus(isOnline => {
      if (this.required_coe_version) {
        this.correctCoeVersion = this.required_coe_version == coeSimulationService.getMaestroVersion();
      }
      this.online = isOnline;
    });
  }

  ngOnDestroy(): void {
    this.coeSimulationService.stopMonitoringOnlineStatus(this._coeIsOnlineSub);
  }

  onCoeLaunchClick() {
    if (this.coeLaunchClick) {
      this.coeLaunchClick.next();
    }
    this.coeSimulationService.launchCOE();
  }

}
