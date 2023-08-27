import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoSimulationConfig } from 'src/app/modules/shared/classes/co-simulation-config';
import { Message, WarningMessage } from 'src/app/modules/shared/classes/messages';
import { maestroVersions } from 'src/app/modules/shared/services/maestro-api.service';
import { CoeSimulationService } from '../../services/coe-simulation.service';
import IntoCpsApp from 'src/app/modules/shared/classes/into-cps-app';

const shell: any = {};

@Component({
  selector: 'app-coe-simulation',
  templateUrl: './coe-simulation.component.html',
  styleUrls: ['./coe-simulation.component.scss']
})
export class CoeSimulationComponent {

  _path!: string;
  _masterModel: string = "";
  _resultsDir: string = "";
  parsing: boolean = false;
  _coeIsOnlineSub: Subscription;
  correctCoeVersion: boolean = true;

  @Input()
  external_disable_simulation: boolean = false;

  //FIXME: This is a non angular Interface
  @Input()
  required_coe_version!: maestroVersions;

  @Input()
  set resultsdir(resultsDir: string) {
    this._resultsDir = resultsDir;
  }

  get resultsdir(): string {
    return this._resultsDir;
  }

  @Input()
  set mastermodel(masterModel: string) {
    this._masterModel = masterModel;
  }

  get mastermodel(): string {
    return this._masterModel;
  }

  @Input()
  set path(path: string) {
    this._path = path;

    if (path) {
      this.parseConfig();

      if (this.coeSimulation) this.coeSimulation.reset();
    }
  }
  get path(): string {
    return this._path;
  }

  online: boolean = false;
  hasHttpError: boolean = false;
  httpErrorMessage: string = "";
  url: string = "";
  version: string = "";
  //FIXME: This is a non angular Interface
  config!: CoSimulationConfig;
  //FIXME: This is a non angular Interface
  mmWarnings: WarningMessage[] = [];
  //FIXME: This is a non angular Interface
  coeWarnings: WarningMessage[] = [];
  //FIXME: This is a non angular Interface
  simWarnings: WarningMessage[] = [];
  hasPostScriptOutput = false;
  hasPostScriptOutputError = false;
  postScriptOutput = "";
  simulating: boolean = false;
  hasRunSimulation: boolean = false;

  constructor(
    //FIXME: This is a non angular Interface
    public coeSimulation: CoeSimulationService,
    private zone: NgZone
  ) {
    this._coeIsOnlineSub = coeSimulation.coeIsOnlineObservable.subscribe(async isOnline => {
      if (this.required_coe_version) {
        this.correctCoeVersion = this.required_coe_version == (await this.coeSimulation.getMaestroVersion());
      }
      this.online = isOnline;
    });
  }

  ngOnDestroy() {
    this._coeIsOnlineSub.unsubscribe();
  }

  async parseConfig() {
    //FIXME: This is a non angular Interface
    let project = IntoCpsApp.getInstance()?.getActiveProject();
    this.parsing = true;

    CoSimulationConfig.parse(
      this.path,
      project?.getRootFilePath() ?? "",
      await project?.getFmusPath() ?? ""
    ).then(config =>
      this.zone.run(async () => {
        this.config = config;

        this.mmWarnings = this.config.multiModel.validate();
        this.coeWarnings = await this.config.validate();

        this.parsing = false;
      })
    ).catch(error => console.error("error when parsing co-sim-config: " + error));
  }

  canRun() {
    return (
      this.online &&
      this.mmWarnings.length === 0 &&
      this.coeWarnings.length === 0 &&
      !this.parsing &&
      !this.simulating &&
      !this.external_disable_simulation &&
      this.correctCoeVersion
    );
  }

  runSimulation() {
    this.zone.run(() => {
      this.hasHttpError = false;
      this.hasPostScriptOutput = false;
      this.hasPostScriptOutputError = false;
      this.postScriptOutput = "";
      this.simulating = true;
    });
    //FIXME: This is a non angular Interface
    const errorReportCB = (hasError: boolean, message: string, hasWarning?: boolean, stopped?: boolean) => {
      this.zone.run(() => {
        this.errorHandler(hasError, message, hasWarning, stopped);
      });
    }
    const simCompletedCB = () => {
      this.zone.run(() => {
        this.hasRunSimulation = true;
        this.simulating = false;
      });
    }

    //FIXME: This is a non angular Interface
    const postScriptOutputReportCB = (hasError: boolean, message: string) => {
      this.zone.run(() => {
        this.postScriptOutputHandler(hasError, message);
      });
    }

    this.coeSimulation.setSimulationCallBacks(errorReportCB, simCompletedCB, postScriptOutputReportCB);

    if (this._masterModel) {
      this.coeSimulation.startSigverSimulation(this.config, this.mastermodel, this._resultsDir);
    } else {
      this.coeSimulation.startSimulation(this.config);
    }
  }

  onOpenResultsFolder() {
    shell.openPath(this.coeSimulation.getResultsDir());
  }

  stopSimulation() {
    this.zone.run(() => {
      this.simulating = false;
    });
    this.coeSimulation.stop();
  }

  //FIXME: This is a non angular Interface
  errorHandler(hasError: boolean, message: string, hasWarning: boolean = false, stopped?: boolean) {
    if (stopped) {
      var warning = new Message("Co-simulation stopped. COE status OK");
      this.simWarnings.push(warning);
      setTimeout(() => {
        this.simWarnings.pop();
      }, 5000);
      this.simulating = false;
    } else if (!stopped && hasWarning) {
      var warning = new Message("Unknown error, see the console for more info.");
      this.simWarnings.push(warning);
      console.warn(message);
      setTimeout(() => {
        this.simWarnings.pop();
      }, 5000);
      this.simulating = false;
    }
    this.hasHttpError = hasError;
    this.httpErrorMessage = message;
    if (hasError) this.simulating = false;
  }

  //FIXME: This is a non angular Interface
  postScriptOutputHandler(hasError: boolean, message: string) {
    this.hasPostScriptOutput = true;
    this.hasPostScriptOutputError = hasError;
    this.postScriptOutput = message;
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

}
