import { Component, Input, NgZone, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/modules/shared/classes/project';
import { MaestroApiService } from 'src/app/modules/shared/services/maestro-api.service';
import * as fs from 'fs'
import * as Path from "path";
import IntoCpsApp from 'src/app/modules/shared/classes/into-cps-app';
import { SettingKeys } from 'src/app/modules/shared/classes/setting-keys';
import { DomSanitizer } from '@angular/platform-browser';
import { CoSimulationStudioApi } from 'src/app/api';

const dialog: any = {};


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
            let app: IntoCpsApp | undefined = IntoCpsApp.getInstance() ?? undefined;
            let p: string = app?.getActiveProject()?.getRootFilePath() ?? "";
            this.cosimConfig = this.loadCosimConfigs(Path.join(p, Project.PATH_MULTI_MODELS));
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
    simulation: boolean = false;/* 
  resultshtml: any = null; */
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

    getFiles(path: string): string[] {
        var fileList: string[] = [];
        var files = fs.readdirSync(path);
        for (var i in files) {
            var name = Path.join(path, files[i]);
            if (fs.statSync(name).isDirectory()) {
                fileList = fileList.concat(this.getFiles(name));
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


    loadCosimConfigs(path: string): string[] {
        var files: string[] = this.getFiles(path);
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

    /*
     * Method to run a DSE with the current DSE configuration. Assumes that the DSE can be run. 
     * The method does not need to send the DSEConfiguration object, simply the correct paths. It relies upon the
     * config being saved to json format correctly.
     */
    runDse() {
        var dir = Path.dirname(this._path);
        fs.watch(dir, (eventType, filename) => {
            if (filename) {
                if (eventType == 'rename') {
                    this.resultdir = Path.join(dir, filename);
                }
            } else {
                console.log('filename not provided');
            }
        });
        this.simulation = true;
        this.simfailed = false;
        this.simsuccess = false;
        var stdoutChunks: any[] = [];
        var stderrChunks: any[] = [];
        var spawn = require('child_process').spawn;
        let installDir = IntoCpsApp.getInstance()?.getSettings().getValue(SettingKeys.INSTALL_DIR);

        let absoluteProjectPath = IntoCpsApp.getInstance()?.getActiveProject()?.getRootFilePath() ?? "";
        let experimentConfigName = this._path.slice(absoluteProjectPath.length + 1, this._path.length);
        let multiModelConfigName = this.coeconfig.slice(absoluteProjectPath.length + 1, this.coeconfig.length);


        //Using algorithm selector script allows any algortithm to be used in a DSE config.
        let scriptFile = Path.join(installDir, "dse", "Algorithm_selector.py");
        var dseScriptOptions = [scriptFile, absoluteProjectPath, experimentConfigName, multiModelConfigName, `-t ${this.threadCount}`];

        if (!this.generateHTMLOutput)
            dseScriptOptions.push("-noHTML");
        if (!this.generateCSVOutput)
            dseScriptOptions.push("-noCSV");

        var child = spawn("python", dseScriptOptions, {
            /* detached: true, */
            shell: false,
            // cwd: childCwd
        });
        child.unref();

        child.on('error', (err: any) => {
            // When the python was not found in your system
            console.error('Failed to start subprocess.' + err.message);
            dialog.showMessageBox(
                {
                    type: "error",
                    buttons: ["OK"],
                    message:
                        "Python spawn failed \n" +
                        "Check if Python is install and available in the path \n" +
                        err.message
                }
            );
            this.simfailed = true;
            this.simulation = false;
        });

        child.on('close', (code: any) => {
            console.log(`child process close all stdio with code ${code}`);
        });

        child.on('end', (code: any) => {
            console.log(`child process exited with code ${code}`);
        });

        child.stdout.on('data', function (data: any) {
            stdoutChunks = stdoutChunks.concat(data);
        });
        child.stdout.on('end', () => {
            var stdoutContent = Buffer.concat(stdoutChunks).toString();
            console.log('stdout chars:', stdoutContent.length);
            // see the output uncomment this line
            // console.log(stdoutContent);
        });
        child.stderr.on('data', function (data: any) {
            stderrChunks = stderrChunks.concat(data);
        });
        child.stderr.on('end', async () => {
            var stderrContent = Buffer.concat(stderrChunks).toString();
            console.log('stderr chars:', stderrContent.length);

            console.log(stderrContent);
            if (stderrContent.length > 0) {
                this.parseError = stderrContent;
                console.warn(this.parseError);
                this.simfailed = true;
                this.simulation = false;
                dialog.showMessageBox(
                    {
                        type: "error",
                        buttons: ["OK"],
                        message:
                            "Running DSE failed. \n" +
                            this.parseError.toString().substr(0, 25) +
                            "See full error description in devtools. \n"
                    }
                );
            } else {
                this.simsuccess = true;
                this.simulation = false;
                console.log("end DSE sim");
                this.resultpath = await CoSimulationStudioApi.normalize(`${this.resultdir}/results.html`);
            }
        });
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
