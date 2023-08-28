import { Component, Input, NgZone, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/modules/shared/classes/project';
import { MaestroApiService } from 'src/app/modules/shared/services/maestro-api.service';
import { SettingKeys } from 'src/app/modules/shared/classes/setting-keys';
import { CoSimulationStudioApi } from 'src/app/api';

@Component({
    selector: 'app-dse-coe-launch',
    templateUrl: './dse-coe-launch.component.html',
    styleUrls: ['./dse-coe-launch.component.scss']
})
export class DseCoeLaunchComponent implements OnInit {

    _path!: string;
    resultdir!: string;
    _coeIsOnlineSub: Subscription;

    @Input()
    set path(path: string) {
        this._path = path;
        if (path) {
            CoSimulationStudioApi.getRootFilePath().then(async (p: string) => {
                this.cosimConfig = await this.loadCosimConfigs(await CoSimulationStudioApi.join(p, Project.PATH_MULTI_MODELS));
            });
        }
    }

    get path(): string {
        return this._path;
    }

    generateHTMLOutput: boolean = true;
    generateCSVOutput: boolean = true;
    threadCount: number = 1;

    editing: boolean = false;
    editingMM: boolean = false;
    simsuccess: boolean = false;
    simfailed: boolean = false;
    parseError: string | null = null;
    simulation: boolean = false;
    //resultshtml: any = null;
    resultpath: any = null;

    mmSelected: boolean = true;
    mmPath: string = '';

    cosimConfig: string[] = [];
    mmOutputs: string[] = [];
    objNames: string[] = [];

    @Input()
    coeconfig: string = '';

    online: boolean = false;

    constructor(public maestroApiService: MaestroApiService, private zone: NgZone) {
        this._coeIsOnlineSub = this.maestroApiService.startMonitoringOnlineStatus(isOnline => this.online = isOnline);
    }

    ngOnInit() {
        console.log(this.path);
    }

    ngOnDestroy() {
        this.maestroApiService.stopMonitoringOnlineStatus(this._coeIsOnlineSub);
    }

    async getFiles(path: string): Promise<string[]> {
        var fileList: string[] = [];
        var files = await CoSimulationStudioApi.readdir(path);
        for (var i in files) {
            var name = await CoSimulationStudioApi.join(path, files[i]);
            if (await CoSimulationStudioApi.isDirectory(name)) {
                fileList = fileList.concat(await this.getFiles(name));
            } else {
                fileList.push(name);
            }
        }
        return fileList;
    }

    resetParseError() {
        this.zone.run(() => {
            this.parseError = null;
        });
    }

    async loadCosimConfigs(path: string): Promise<string[]> {
        var files: string[] = await this.getFiles(path);
        return files.filter(f => f.endsWith("coe.json"));
    }

    /*
     * Method to check if can run a DSE. Will check if the COE is online, if there are any warnings
     * and also some DSE-specific elements
     */
    canRun() {
        return this.online
            && this.coeconfig != ""
            && !this.simulation
        /* && this.dseWarnings.length === 0
        && this.coeWarnings.length === 0 */
        //&& this.config.dseSearchParameters.length > 1 
        /*   && this.config
          && this.config.extScrObjectives
          && (this.config.extScrObjectives.length + this.config.intFunctObjectives.length) >= 2; */
    }

    async runDse(): Promise<void> {
        await CoSimulationStudioApi.runDse();
    }

    updateThreadCount(value: string) {
        const iValue = parseInt(value);
        if (iValue <= 0)
            throw new Error(`Thread count should be greater than or equal to 1 given: ${iValue}`);
        this.threadCount = iValue;
    }

    setGenerateHTMLOutput() {
        this.generateHTMLOutput = !this.generateHTMLOutput;
    }

    setGenerateCSVOutput() {
        this.generateCSVOutput = !this.generateCSVOutput;
    }

}
