import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import JSZip from 'jszip';
import { map, Subject, Subscription, timeout, timer } from 'rxjs';
import { CoeProcess } from '../classes/coe-process';
import * as fs from 'fs'
import { SettingsService } from './settings.service';

import IntoCpsApp from '../classes/into-cps-app';
import { SettingKeys } from './settings.service';
import { CoSimulationStudioApi } from 'src/app/api';

// Verificaiton DTO utilised by Maestro
interface IVerificationDTO {
  verifiedSuccessfully: boolean;
  uppaalModel: string;
  errorMessage: string;
};

// The json error format of Maestro
interface IVndError {
  logref: string;
  message: string;
}

export enum simulationEndpoints {
  simulate = "simulate",
  sigverSimulate = "sigverSimulate"
}

export enum maestroVersions {
  maestroV1 = 1,
  maestroV2 = 2
}


@Injectable({
  providedIn: 'root'
})
export class MaestroApiService {

  _coe?: CoeProcess;
  _coeIsOnline = new Subject<boolean>();
  _timerSubscription!: Subscription;

  coeVersionNumber: string = "";
  coeUrl?: string;

  constructor(private httpClient: HttpClient, public settings: SettingsService) {
    this.settings.get(SettingKeys.COE_URL).then(value => {
      this.coeUrl = value;
    })
    this._coe = IntoCpsApp.getInstance()?.getCoeProcess() ?? undefined;
  }

  ngOnDestroy() {
    this._timerSubscription.unsubscribe();
  }

  /* 
      Simulation API entry points methods
  */
  getCoeVersionNumber(): Promise<string | undefined> {
    return CoSimulationStudioApi.httpGet<string>(`http://${this.coeUrl}/version`).pipe(timeout(2000), map((response: any) => {
      //This regex match expects the coe version number to have the format x.x.x
      this.coeVersionNumber = response.version.match('[\\d\\.]+')[0];
      return this.coeVersionNumber;
    })).toPromise();
  }

  stopSimulation(simulationSessionId: string): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      CoSimulationStudioApi.httpGet(`http://${this.coeUrl}/stopsimulation/${simulationSessionId}`)
        .subscribe((res: any) => { resolve(res) }, (err: Response) => reject(err));
    });
  }

  launchCOE() {
    if (!this._coe?.isRunning()) IntoCpsApp.getInstance()?.getCoeProcess()?.start();
  }

  createSimulationSession(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      CoSimulationStudioApi.httpGet(`http://${this.coeUrl}/createSession`).subscribe((response: any) => resolve(response.sessionId), (err: Response) => reject(err));
    });
  }

  uploadFmus(fmus: FormData, simulationSessionId: string): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      this.httpClient.post(`http://${this.coeUrl}/upload/${simulationSessionId}`, fmus)
        .subscribe((res: any) => { resolve(res) }, (err: Response) => reject(err));
    });
  }

  initializeCoe(configJson: any, simulationSessionId: string): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      this.httpClient.post(`http://${this.coeUrl}/initialize/${simulationSessionId}`, configJson)
        .subscribe((res: any) => { resolve(res) }, (err: Response) => reject(err));
    });
  }

  getPlainResult(simulationSessionId: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.httpClient.get(`http://${this.coeUrl}/result/${simulationSessionId}/plain`, { responseType: 'text' })
        .subscribe((res) => resolve(res), (err: Response) => reject(err))
    });
  }

  getResults(resultsPath: string, simulationSessionId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      var resultsStream = fs.createWriteStream(resultsPath);
      CoSimulationStudioApi.httpGet(`http://${this.coeUrl}/result/${simulationSessionId}/zip`).subscribe((response: any) => {
        if (response.statusCode != 200) {
          reject(response);
        }
        response.pipe(resultsStream);
        response.on('end', () => {
          resolve();
        });
      });
    });
  }

  destroySession(simulationSessionId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      CoSimulationStudioApi.httpGet(`http://${this.coeUrl}/destroy/${simulationSessionId}`).subscribe((response: any) => {
        if (response.statusCode != 200) {
          reject(response);
        } else {
          resolve();
        }
      });
    });
  }

  simulate(simulationData: any, simulationEndpoint: simulationEndpoints, simulationSessionId: string): Promise<Response> {
    return new Promise<Response>((resolve, reject) => {
      this.httpClient.post(`http://${this.coeUrl}/${simulationEndpoint}/${simulationSessionId}`, simulationData)
        .subscribe((res: any) => { resolve(res) }, (err: Response) => reject(err));
    });
  }

  executeViaCLI(simulationSessionId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.httpClient.post(`http://${this.coeUrl}/executeViaCLI/${simulationSessionId}`, { "executeViaCLI": true }).subscribe(() => resolve(), (err: Response) => reject(err));
    });
  }

  /* 
      Scenario verifier API entry points methods
  */
  generateScenario(extendedMultiModelObj: Object): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      this.httpClient.post(`http://${this.coeUrl}/generateAlgorithmFromMultiModel`, extendedMultiModelObj, { responseType: 'text' }).toPromise().then(response => {
        const blob = new Blob([<any>response], { type: 'text/plain' });
        resolve(new File([blob], "masterModel.conf", { type: blob.type }));
      }, (errorResponse: HttpErrorResponse) => {
        this.errorJsonToMsg(errorResponse).then(msg => reject(msg)).catch(err => { console.log(err); reject(errorResponse.message) });
      })
    });
  }

  verifyAlgorithm(masterModelAsString: string): Promise<IVerificationDTO> {
    return new Promise<IVerificationDTO>((resolve, reject) => {
      this.httpClient.post(`http://${this.coeUrl}/verifyAlgorithm`, masterModelAsString).toPromise().then(response => {
        resolve(response as IVerificationDTO);
      }, (errorResponse: HttpErrorResponse) => {
        this.errorJsonToMsg(errorResponse).then(msg => reject(msg)).catch(err => { console.log(err); reject(errorResponse.message) });
      })
    });
  }

  visualizeTrace(masterModelAsString: string): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      this.httpClient.post(`http://${this.coeUrl}/visualizeTrace`, masterModelAsString).toPromise().then(response => {
        resolve(new File([response as Blob], "trace_visualization.mp4", { lastModified: new Date().getTime(), type: 'blob' }));
      }, (errorResponse: HttpErrorResponse) => {
        this.errorJsonToMsg(errorResponse).then(msg => reject(msg)).catch(err => { console.log(err); reject(errorResponse.message) });
      })
    });
  }

  /* 
      Non API methods
  */
  startMonitoringOnlineStatus(callback: (n: boolean) => void): Subscription {
    if (!this._timerSubscription || this._timerSubscription.closed) {
      this._timerSubscription = timer(0, 2000).subscribe(() => this.isCoeOnline());
    }
    return this._coeIsOnline.asObservable().subscribe(callback);
  }

  stopMonitoringOnlineStatus(subscription: Subscription) {
    subscription.unsubscribe();
    if (this._coeIsOnline.observers.length < 1) {
      this._timerSubscription.unsubscribe();
    }
  }

  getWebSocketSessionUrl(simulationSessionId: string): string {
    return `ws://${this.coeUrl}/attachSession/${simulationSessionId}`;
  }

  async getMaestroVersion(): Promise<maestroVersions> {
    if (!await this.getCoeVersionNumber()) {
      return maestroVersions.maestroV1;
    }

    let version: maestroVersions;

    switch (Number.parseInt(this.coeVersionNumber.split('.')[0])) {
      case 1:
        version = maestroVersions.maestroV1;
        break;
      case 2:
        version = maestroVersions.maestroV2;
        break;
      default:
        version = maestroVersions.maestroV1;
    }

    if (!version) {
      console.warn("Unknown Maestro version: " + this.coeVersionNumber);
    }
    return version;
  }

  async isRemoteCoe(): Promise<boolean> {
    return CoSimulationStudioApi.getConfiguration(SettingKeys.COE_REMOTE_HOST);
  }

  getCoeProcess(): CoeProcess | undefined {
    if (!this._coe) {
      this._coe = IntoCpsApp.getInstance()?.getCoeProcess() ?? undefined;
    }
    return this._coe;
  }

  async inferMaestroVersionFromJarContent(): Promise<maestroVersions> {

    // read the contents of the maestro jar
    const data = await CoSimulationStudioApi.readFile(this._coe?.getCoePath() ?? "");

    //reject("Unable to infer maestro version from jar: " + err);

    const zip = await JSZip.loadAsync(data)

    if (Object.keys(zip.files).findIndex(file => file.toLowerCase().endsWith(".mabl")) > -1) {
      return maestroVersions.maestroV2;
    } else {
      return maestroVersions.maestroV1;
    }

  }

  private isCoeOnline() {
    this.getCoeVersionNumber().then(() => this._coeIsOnline.next(true)).catch(() => this._coeIsOnline.next(false));
  }

  private formatErrorMessage(statusCode: number, IVndErrors: IVndError[]): string {
    return statusCode + " => " + IVndErrors.map(vndErr => vndErr.message).reduce((msg, currMsg) => currMsg + "<" + msg + ">");
  }

  // Convert the error message returned from Maestro into a string format.
  private errorJsonToMsg(err: HttpErrorResponse): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (typeof err.error === "string") {
        const IVndErrors: IVndError[] = JSON.parse(err.error as string);
        resolve(this.formatErrorMessage(err.status, IVndErrors));;
      }
      else if (err.error instanceof Blob && err.error.type === "application/json") {
        const reader = new FileReader();
        reader.onload = (e: Event) => {
          const IVndErrors: IVndError[] = JSON.parse((<any>e.target).result);
          resolve(this.formatErrorMessage(err.status, IVndErrors));
        }
        reader.onerror = (e) => {
          reject(err);
        };
        reader.readAsText(err.error);
      }
      else if (err.error.type === "application/json") {
        try {
          resolve(this.formatErrorMessage(err.status, (err.error as IVndError[])));
        }
        catch (exc) {
          reject(`Unable to convert to error format: ${exc}`);
        }
      }
      else {
        reject("Unable to convert to error format");
      }
    });
  }

}
