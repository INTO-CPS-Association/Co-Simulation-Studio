import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoSimulationConfig } from 'src/app/modules/shared/classes/co-simulation-config';
import { Reactivity, SigverConfiguration } from 'src/app/modules/shared/classes/sigver-configuration';
import { Project } from 'src/app/modules/shared/classes/project';
import { SigverConfigurationService } from '../../services/sigver-configuration.service';
import { CoSimulationStudioApi } from 'src/app/api';

@Component({
	selector: 'app-sigver-configuration',
	templateUrl: './sigver-configuration.component.html',
	styleUrls: ['./sigver-configuration.component.scss']
})
export class SigverConfigurationComponent {

	coePath: string = "";
	_configurationLoadedSub: Subscription;

	public reactivityKeys = Object.keys(Reactivity);
	public editing: boolean = false;
	public usePriorExperiment: boolean = false;
	public cantLocatePriorExperiment = false;
	public experimentPath: string = "";
	public priorExperimentPath: string = "";
	public experimentsPaths: string[] = [];
	public priorExperimentsPaths: string[] = [];
	public coeConfig!: CoSimulationConfig;
	public portsToReactivity: Map<string, Reactivity> = new Map();

	constructor(public sigverConfigurationService: SigverConfigurationService) {
		this._configurationLoadedSub = this.sigverConfigurationService.configurationLoadedObservable.subscribe(() => this.handleConfigurationLoaded());
		(async() => {
			const path = await CoSimulationStudioApi.join(await CoSimulationStudioApi.getRootFilePath(), Project.PATH_MULTI_MODELS);
			this.experimentsPaths = await this.getExperimentsPaths(path);
		})();
	}

	ngOnDestroy(): void {
		this._configurationLoadedSub.unsubscribe();
	}

	public async getNameOfSelectedExperiment(): Promise<string> {
		return await this.getExperimentNameFromPath(this.usePriorExperiment ? this.priorExperimentPath : this.experimentPath, this.usePriorExperiment ? 3 : 2);
	}

	public async onExperimentPathChanged(experimentPath: string): Promise<void> {
		try {
			await this.loadPriorExperimentsPaths();
			this.experimentPath = experimentPath;
			this.usePriorExperiment = false;
			this.priorExperimentPath = "";
			this.cantLocatePriorExperiment = false;
			await this.locateAndsetCoePath(experimentPath);
			await this.parseAndSetCoeConfig(this.coePath);
			this.resetConfigurationOptionsViewElements();
		} catch (e) {
			console.error(e);
		}
	}

	public async onPriorExperimentPathChanged(experimentPath: string): Promise<void> {
		this.priorExperimentPath = experimentPath;
		this.usePriorExperiment = true;
		try {
			await this.locateAndsetCoePath(experimentPath);
			await this.parseAndSetCoeConfig(this.coePath);
			this.resetConfigurationOptionsViewElements();
		} catch (e) {
			console.error(e);
		}
	}

	public onReactivityChanged(key: string, reactivity: string) {
		this.portsToReactivity.set(key, Reactivity[reactivity as keyof typeof Reactivity]);
	}

	public async onSubmit(): Promise<void> {

		if (!this.editing) return;

		const updatedSigverConfiguration = new SigverConfiguration();

		// Set changes from the view models in a new configuration
		updatedSigverConfiguration.experimentPath = this.experimentPath;
		updatedSigverConfiguration.masterModel = this.sigverConfigurationService.configuration.masterModel;
		updatedSigverConfiguration.priorExperimentPath = !this.usePriorExperiment ? "" : this.priorExperimentPath;
		updatedSigverConfiguration.reactivity = new Map(this.portsToReactivity);

		const relative = await CoSimulationStudioApi.relative(await CoSimulationStudioApi.dirname(this.sigverConfigurationService.configurationPath), this.coePath);
		const coeFileChanged = await CoSimulationStudioApi.basename(this.coePath) != relative;

		if (coeFileChanged) {
			try {
				await this.updateCoeFileInConfPath();
				updatedSigverConfiguration.coePath = this.coePath;
				updatedSigverConfiguration.coeConfig = await CoSimulationConfig.parse(this.coePath, await CoSimulationStudioApi.getRootFilePath(), await CoSimulationStudioApi.getFmusPath());
			} catch (e) {
				console.warn(e);
			}
		} else {
			updatedSigverConfiguration.coeConfig = this.sigverConfigurationService.configuration.coeConfig;
		}

		updatedSigverConfiguration.coePath = this.coePath;

		//Update and save the configuration - this also triggers a configuration updated event
		this.sigverConfigurationService.configuration = updatedSigverConfiguration;
		this.sigverConfigurationService.saveConfiguration();

		this.editing = false;
	}

	async parseAndSetCoeConfig(coePath: string): Promise<void> {
		try {
			this.coeConfig = await CoSimulationConfig.parse(coePath, await CoSimulationStudioApi.getRootFilePath(), await CoSimulationStudioApi.getFmusPath());
		} catch (e) {
			console.error(`Error during parsing of coe config: ${e}`);
		}
	}

	async getExperimentNameFromPath(path: string, depth: number): Promise<string> {

		const elems = path.split(await CoSimulationStudioApi.sep());
		if (elems.length <= 1) {
			return path;
		}

		let pathToReturn = "";
		for (let i = depth; i >= 1; i--) {
			pathToReturn += elems[elems.length - i] + (i == 1 ? "" : " | ");
		}

		return pathToReturn;

	}

	async getExperimentsPaths(path: string): Promise<string[]> {

		let experimentPaths: string[] = [];
		const files = await CoSimulationStudioApi.readdir(path);
		const coeFileName = files.find((f) => f.endsWith("coe.json"));

		if (coeFileName && (await CoSimulationStudioApi.readJson(await CoSimulationStudioApi.join(path, coeFileName)))?.algorithm?.type != "var-step") {
			experimentPaths.push(path);
		} else {
			for (let i in files) {
				let fileName = await CoSimulationStudioApi.join(path, files[i]);
				if (await CoSimulationStudioApi.isDirectory(fileName)) {
					experimentPaths = experimentPaths.concat(await this.getExperimentsPaths(fileName));
				}
			}
		}

		return experimentPaths;

	}

	resetConfigurationOptionsViewElements(): void {
		// Set port reactivities to delayed
		const inputPorts: string[] = Object.values(this.coeConfig.multiModel.toObject().connections as Map<string, string[]>).reduce((prevVal, currVal) => prevVal.concat(currVal), []);
		this.portsToReactivity = new Map(inputPorts.map((p) => [p, Reactivity.Delayed]));
	}

	async locateAndsetCoePath(coeDir: string): Promise<void> {

		if (!coeDir) {
			return;
		}

		if (!await CoSimulationStudioApi.exists(coeDir) || !await CoSimulationStudioApi.isDirectory(coeDir)) {
			throw new Error(`"${coeDir}" is not a valid directory`);
		}

		const filesInCOEDir = await CoSimulationStudioApi.readdir(coeDir);
		const coeFileName = filesInCOEDir.find((fileName) => fileName.toLowerCase().endsWith("coe.json"));

		if (coeFileName) {
			this.coePath = await CoSimulationStudioApi.join(coeDir, coeFileName);
		} else {
			throw new Error("Unable to locate coe file in directory: " + coeDir);
		}

	}

	async loadPriorExperimentsPaths(): Promise<void> {

		let priorExperimentsPaths: string[] = [];
		const files = await CoSimulationStudioApi.readdir(this.experimentPath);

		for (let i in files) {
			let fileName = await CoSimulationStudioApi.join(this.experimentPath, files[i]);
			if (await CoSimulationStudioApi.isDirectory(fileName)) {
				priorExperimentsPaths = priorExperimentsPaths.concat(await this.getExperimentsPaths(fileName));
			}
		}

		this.priorExperimentsPaths = priorExperimentsPaths;
	}

	async updateCoeFileInConfPath(): Promise<void> {

		const filesInDir = await CoSimulationStudioApi.readdir(await CoSimulationStudioApi.dirname(this.sigverConfigurationService.configurationPath));

		//Find the old co-simulation file and delete it if present.
		const existingCoeFile = filesInDir.find((fileName) => fileName.toLowerCase().endsWith("cos.json"));

		if (existingCoeFile) {
			const pathToFile = await CoSimulationStudioApi.join(await CoSimulationStudioApi.dirname(this.sigverConfigurationService.configurationPath), existingCoeFile);
			await CoSimulationStudioApi.unlink(pathToFile);
		}

		//Copy the new file to the sigver project
		this.coePath = await this.copyCoeToConfigPath();

	}

	async copyCoeToConfigPath(): Promise<string> {

		const expName = this.experimentPath.split(await CoSimulationStudioApi.sep());

		const newCoeFileName = "sigver_" + expName[expName.length - 2] + "_" + expName[expName.length - 1] + "_" + "cos.json";
		const destinationPath = await CoSimulationStudioApi.join(await CoSimulationStudioApi.dirname(this.sigverConfigurationService.configurationPath), newCoeFileName);

		await CoSimulationStudioApi.copyFile(this.coePath, destinationPath);
		return destinationPath;

	}

	handleConfigurationLoaded() {

		// Set view element values from the configuration
		this.experimentPath = this.sigverConfigurationService.configuration.experimentPath;
		let coeFolderPath = this.experimentPath;
		this.usePriorExperiment = this.sigverConfigurationService.configuration.priorExperimentPath != "";

		if (this.experimentPath != "") {
			this.loadPriorExperimentsPaths();
		}

		if (this.usePriorExperiment) {
			this.priorExperimentPath = this.sigverConfigurationService.configuration.priorExperimentPath;
			this.cantLocatePriorExperiment = this.priorExperimentsPaths.findIndex((p) => p.includes(this.priorExperimentPath)) == -1;
			coeFolderPath = this.priorExperimentPath;
		}

		if (coeFolderPath) {
			this.locateAndsetCoePath(coeFolderPath)
				.then(async () => await this.parseAndSetCoeConfig(this.coePath))
				.catch((err) => {
					console.error(err);
				});
		}

		this.portsToReactivity = new Map(this.sigverConfigurationService.configuration.reactivity);

	}
}
