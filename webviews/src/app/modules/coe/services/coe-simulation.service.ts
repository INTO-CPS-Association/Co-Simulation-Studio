import { Injectable, NgZone } from '@angular/core';
import * as Path from "path";
import * as fs from 'fs'
import { CoSimulationConfig, LiveGraph } from '../../shared/classes/configuration/co-simulation-config';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { Graph } from '../../shared/classes/graph';
import DialogHandler from '../../shared/classes/dialog-handler';
import { FileSystemService } from '../../shared/services/file-system.service';
import { MaestroApiService, simulationEndpoints } from '../../shared/services/maestro-api.service';
import { storeResultCrc } from '../../shared/classes/configuration/result-config';
import { CoeConfig } from '../../shared/classes/models/coe-config';
import { Deferred } from '../../shared/classes/deferred';
import { SettingsService } from '../../shared/services/settings.service';
import { Fmu } from '../../shared/classes/models/fmu';
import { SettingKeys } from '../../shared/services/settings.service';

const child_process: any = {};

@Injectable({
    providedIn: 'root'
})
export class CoeSimulationService {

    progress: number = 0;
    errorReport: (hasError: boolean, message: string, hasWarning?: boolean, stopped?: boolean) => void = function () { };
    simulationCompletedHandler: () => void = function () { };
    postProcessingOutputReport: (hasError: boolean, message: string) => void = function () { };

    _simulationSessionId: string = "";
    _resultDir!: string;
    _resultPath!: string;
    _coeConfigPath!: string;
    _mmConfigPath!: string;
    masterModel!: string;
    config!: CoSimulationConfig;
    graphMaxDataPoints: number = 100;
    _coeIsOnlineSub: Subscription;
    _coeIsOnline = new Subject<boolean>();

    public graph: Graph = new Graph();
    public externalGraphs: Array<DialogHandler> = new Array<DialogHandler>();
    public coeIsOnlineObservable: Observable<boolean> = this._coeIsOnline.asObservable();
    public coeUrl: string;

    set resultDir(resultsDir: string) {
        this._resultDir = resultsDir;
        this._resultPath = Path.normalize(`${this.resultDir}/outputs.csv`);
        this._coeConfigPath = Path.normalize(`${this.resultDir}/coe.json`);
        this._mmConfigPath = Path.normalize(`${this.resultDir}/mm.json`);
    }

    get resultDir(): string {
        return this._resultDir;
    }

    constructor(
        public settings: SettingsService,
        public fileSystem: FileSystemService,
        public zone: NgZone,
        public maestroApiService: MaestroApiService) {

        this.graphMaxDataPoints = settings.get(SettingKeys.GRAPH_MAX_DATA_POINTS);
        this.graph.setProgressCallback((progress: number) => { this.progress = progress });
        this.graph.setGraphMaxDataPoints(this.graphMaxDataPoints);

        this.coeUrl = maestroApiService.coeUrl;
        this._coeIsOnlineSub = this.maestroApiService.startMonitoringOnlineStatus(isOnline => this._coeIsOnline.next(isOnline));
    }

    ngOnDestroy(): void {
        this.maestroApiService.stopMonitoringOnlineStatus(this._coeIsOnlineSub);
    }

    getCoeVersion() {
        return this.maestroApiService.coeVersionNumber;
    }

    getMaestroVersion() {
        return this.maestroApiService.getMaestroVersion();
    }

    reset() {
        this.progress = 0;
        this.zone.run(() => {
            this.graph.reset();
        });
    }

    openCOEServerStatusWindow(
        data: string = "",
        show: boolean = true
    ) {
        this.maestroApiService.launchCOE();
    }

    getResultsDir(): string {
        return this.resultDir;
    }

    stop(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.maestroApiService.stopSimulation(this._simulationSessionId).then(() => resolve()).catch((res: Response) => reject(res.statusText));
        });
    }

    startSigverSimulation(config: CoSimulationConfig, masterModel: string, resultsDir: string) {
        this.config = config;
        this.masterModel = masterModel;
        this.resultDir = Path.normalize(`${resultsDir}/R_${this.getDateString()}`);
        this.initialize().then(() => {
            const simulationData: any = {
                startTime: this.config.startTime,
                endTime: this.config.endTime,
                reportProgress: true,
                liveLogInterval: this.config.livestreamInterval,
                masterModel: this.masterModel
            };

            this.handleSimulationFinished(this.prepareGraphAndrunSimulation(simulationEndpoints.simulate, simulationData));
        }).catch(err => this.errorHandler(err));
    }

    startSimulation(config: CoSimulationConfig) {
        this.config = config;
        const currentDir = Path.dirname(this.config.sourcePath);
        this.resultDir = Path.normalize(`${currentDir}/R_${this.getDateString()}`);
        this.initialize().then(() => {
            const simulationData: any = {
                startTime: this.config.startTime,
                endTime: this.config.endTime,
                reportProgress: true,
                liveLogInterval: this.config.livestreamInterval
            };

            // enable logging for all log categories        
            const logCategories: any = new Object();
            let self = this;
            this.config.multiModel.fmuInstances.forEach(instance => {
                let key: any = instance.fmu.name + "." + instance.name;

                if (self.config.enableAllLogCategoriesPerInstance) {
                    logCategories[key] = instance.fmu.logCategories;
                }
            });
            Object.assign(simulationData, { logLevels: logCategories });

            this.handleSimulationFinished(this.prepareGraphAndrunSimulation(simulationEndpoints.simulate, simulationData));
        }).catch(err => this.errorHandler(err));
    }

    errorHandler(err: Response, stopped?: boolean) {
        console.warn(err);
        if (stopped) {
            this.progress = 0;
            this.errorReport(false, "Error: " + err.statusText, true, true)
        } else if (!stopped && err.status == 200) {
            this.progress = 0;
            this.errorReport(false, "Error: " + err.statusText, true)
        } else {
            this.progress = 0;
            this.errorReport(true, "Error: " + err.statusText);
        }
    }

    setSimulationCallBacks(errorReport: (hasError: boolean, message: string, hasWarning?: boolean, stopped?: boolean) => void, simCompleted: () => void, postScriptOutputReport: (hasError: boolean, message: string) => void) {
        this.errorReport = errorReport;
        this.simulationCompletedHandler = simCompleted;
        this.postProcessingOutputReport = postScriptOutputReport;
    }

    handleSimulationFinished(simulationPromise: Promise<void>) {
        simulationPromise.then(() => {
            // If simulation finished successfully get the plain results
            this.maestroApiService.getPlainResult(this._simulationSessionId).then(async (resultsString: string) => {
                await Promise.all([
                    this.fileSystem.writeFile(this._resultPath, resultsString),
                    this.fileSystem.copyFile(this.config.sourcePath, this._coeConfigPath),
                    this.fileSystem.copyFile(this.config.multiModel.sourcePath, this._mmConfigPath)
                ]).then(async () => {
                    // Store the results and run the post processing script
                    storeResultCrc(this._resultPath, this.config);
                    this.executePostProcessingScript(this._resultPath);
                }).catch(err => console.log("Unable to write plain results to file: " + err));
            }).catch((err: Response) => this.errorHandler(err));
        }).finally(() =>
            // Always get whatever results have been generated
            this.maestroApiService.getResults(Path.normalize(`${this.resultDir}/simulation_results.zip`), this._simulationSessionId).finally(() => {
                // End the session
                this.maestroApiService.destroySession(this._simulationSessionId).catch((err: Response) => console.error("Could not destroy session: " + err.statusText));
            })
                .catch((err: Response) => {
                    console.error("Could retrieve results: " + err.statusText);
                })
        );
    }

    getDateString(): string {
        const now = new Date();
        const nowAsUTC = new Date(Date.UTC(now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
            now.getMilliseconds())
        );
        return nowAsUTC.toISOString().replace(/-/gi, "_")
            .replace(/T/gi, "-")
            .replace(/Z/gi, "")
            .replace(/:/gi, "_")
            .replace(/\./gi, "_");
    }

    async initialize(): Promise<void> {
        this.reset();
        this.graph.setCoSimConfig(this.config);
        this.graph.initializeDatasets();
        this.maestroApiService.getCoeProcess()?.prepareSimulation();
        this.errorReport(false, "");
        return this.maestroApiService.createSimulationSession().then(async sessionId => {
            this._simulationSessionId = sessionId;
            if (this.maestroApiService.isRemoteCoe()) {
                await this.prepareAndUploadFmus().catch(err => this.errorHandler(err));
            }
            return this.prepareAndInitializeCoe();
        });
    }

    prepareAndUploadFmus(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const formData = new FormData();

            this.config.multiModel.fmus.forEach((value: Fmu) => {
                this.fileSystem.readFile(value.path).then(content => {
                    formData.append(
                        'file',
                        new Blob([content], { type: "multipart/form-data" }),
                        value.path
                    );
                });
            });

            this.maestroApiService.uploadFmus(formData, this._simulationSessionId).then(() => resolve()).catch((err: Response) => reject(err));
        });
    }

    prepareAndInitializeCoe(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const configJson = new CoeConfig(this.config, this.maestroApiService.isRemoteCoe()).toJSON();
            Promise.all([
                this.fileSystem.mkdir(this.resultDir),
                this.maestroApiService.initializeCoe(configJson, this._simulationSessionId)
            ]).catch(err => reject(err)).finally(() => {
                this.fileSystem.writeFile(Path.join(this.resultDir, "config.json"), configJson);
                resolve();
            })
        });
    }

    prepareGraphAndrunSimulation(simulationEndpoint: simulationEndpoints, simulationData: any): Promise<void> {
        let deferreds = new Array<Promise<any>>();

        this.graph.graphMap.forEach((value: BehaviorSubject<any[]>, key: LiveGraph) => {
            if (key.externalWindow) {
                let deferred: Deferred<any> = new Deferred<any>();
                deferreds.push(deferred.promise);
                let graphObj = key.toObject();
                graphObj.webSocket = this.maestroApiService.getWebSocketSessionUrl(this._simulationSessionId);
                graphObj.graphMaxDataPoints = this.graphMaxDataPoints;
                console.log(graphObj);
                let dh = new DialogHandler("angular2-app/coe/graph-window/graph-window.html", 800, 600);
                dh.openWindow(JSON.stringify(graphObj), true);
                this.externalGraphs.push(dh);
                dh.win.webContents.on("did-finish-load", () => {
                    dh.win.setTitle("Plot: " + key.title);
                    deferred.resolve?.();
                });
            }
        });
        return new Promise<void>((resolve, reject) => {
            Promise.all(deferreds).then(() => {
                // Do not start the simulation before the websocket is open.
                this.graph.webSocketOnOpenCallback = () => this.fileSystem.writeFile(Path.join(this.resultDir, "config-simulation.json"), JSON.stringify(simulationData))
                    .then(() => {
                        // Call the correct simulate endpoint
                        const simulationPromise = this.maestroApiService.simulate(simulationData, simulationEndpoint, this._simulationSessionId);
                        simulationPromise.then(() => {
                            this.graph.closeSocket();
                            let markedForDeletionExternalGraphs: DialogHandler[] = [];
                            this.externalGraphs.forEach((eg) => {
                                if (!eg.win.isDestroyed()) {
                                    eg.win.webContents.send("close");
                                } else {
                                    // The window have been destroyed, remove it from external graphs
                                    markedForDeletionExternalGraphs.push(eg);
                                }
                            });
                            markedForDeletionExternalGraphs.forEach((eg) => {
                                this.externalGraphs.splice(this.externalGraphs.indexOf(eg, 0), 1);
                            });
                            this.graph.setFinished();
                            this.maestroApiService.getCoeProcess()?.simulationFinished();
                            this.progress = 100;
                            this.simulationCompletedHandler();
                            resolve();
                        })
                            .catch((err: Response) => {
                                this.errorHandler(err);
                                reject(err.statusText);
                            });
                    });

                this.graph.launchWebSocket(this.maestroApiService.getWebSocketSessionUrl(this._simulationSessionId));
            });
        });
    }

    executePostProcessingScript(outputFile: string) {

        let script: string = this.config.postProcessingScript;
        let self = this;

        //default will be '.'
        if (script == null || script.length <= 1)
            return;


        let scriptNormalized = Path.normalize(Path.join(this.config.projectRoot, script));
        var scriptExists = false;
        try {
            fs.accessSync(scriptNormalized, fs.constants.R_OK);
            scriptExists = true;

        } catch (e) {

        }

        if (scriptExists) {
            script = scriptNormalized;
        }

        var spawn = child_process.spawn;

        var child = spawn(script, ["\"" + outputFile + "\"", "" + this.config.endTime], {
            detached: true,
            shell: true,
            cwd: Path.dirname(outputFile)
        });
        child.unref();

        child.stdout.on('data', function (data: any) {
            self.postProcessingOutputReport(false, data + "");
        });

        child.stderr.on('data', function (data: any) {
            console.log('stderr: ' + data);
            self.postProcessingOutputReport(true, data + "");
        });
    }
}
