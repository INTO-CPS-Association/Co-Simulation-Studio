import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CoSimulationStudioApi } from 'src/app/api';
import { Reactivity, SigverConfiguration } from '../../shared/classes/sigver-configuration';

@Injectable({
	providedIn: 'root'
})
export class SigverConfigurationService {

	private _configuration: SigverConfiguration = new SigverConfiguration();
	private _configurationChanged = new Subject<boolean>();
	private _configurationLoaded = new Subject<boolean>();

	public configurationChangedObservable = this._configurationChanged.asObservable();
	public configurationLoadedObservable = this._configurationLoaded.asObservable();
	public configurationPath!: string;
	public automaticallySaveOnChanges: boolean = true;
	public isDefaultConfiguration: boolean = true;

	public set configuration(sigverConfiguration: SigverConfiguration) {

		// Search for changes that invalidates the masterModel
		let resetMasterModel: boolean = false;
		if (sigverConfiguration.masterModel != "") {
			for (const entry of Array.from(this._configuration.reactivity.entries())) {
				if (!sigverConfiguration.reactivity.has(entry[0]) || sigverConfiguration.reactivity.get(entry[0]) != entry[1]) {
					resetMasterModel = true;
					break;
				}
			}
		}

		this._configuration = sigverConfiguration;
		this.isDefaultConfiguration = this._configuration.experimentPath == "";
		if (resetMasterModel) {
			this._configuration.masterModel = "";
		}

		this.configurationChanged();

	}

	public get configuration(): SigverConfiguration {
		return this._configuration;
	}

	async loadConfigurationFromPath(path: string = ""): Promise<void> {
		const filePath = path == "" ? this.configurationPath : path;
		try {
			const fileData = await CoSimulationStudioApi.readFile(filePath);
			try {
				this.configuration = await SigverConfiguration.parse(JSON.parse(fileData));
				this.configurationLoaded();
			} catch (e) {
				throw new Error(`Unable to set configuration from file: ${filePath} due to: ${e}`);
			}
		} catch (e) {
			throw new Error(`Unable to read configuration file from: ${filePath} due to: ${e}`);
		}
	}

	configurationChanged() {
		this._configurationChanged.next(true);
	}

	async saveConfiguration(path: string = ""): Promise<boolean> {
		try {
			await CoSimulationStudioApi.writeFile(path == "" ? this.configurationPath : path, JSON.stringify(this._configuration.toObject()));
			await CoSimulationStudioApi.writeFile(this.configuration.coePath, JSON.stringify(this._configuration.coeConfig.toObject()));
		} catch (err) {
			console.error(`Unable to write configuration to file: ${err}`);
			return false;
		}
		return true;
	}

	configurationToExtendedMultiModelDTO(verify: boolean = false): any {
		const extendedMultiModelDTO = this._configuration.coeConfig.multiModel.toObject();
		let fmus: any = {};
		this._configuration.coeConfig.multiModel.fmus.forEach((fmu) => {
			let fmuPath;
			if (fmu.isNested()) {
				fmuPath = "coe:/" + fmu.path;
			} else {
				fmuPath = "file:///" + fmu.path;
			}
			fmus[fmu.name] = fmuPath.replace(/\\/g, "/").replace(/ /g, "%20");
		});
		extendedMultiModelDTO["fmus"] = fmus;

		const reactivity: { [key: string]: Reactivity } = {};
		this._configuration.reactivity.forEach((value: Reactivity, key: string) => (reactivity[key] = value));

		const scenarioVerifierDTO: any = {};
		scenarioVerifierDTO[SigverConfiguration.REACTIVITY_TAG] = reactivity;
		scenarioVerifierDTO["verification"] = verify;
		scenarioVerifierDTO["traceVisualization"] = false;

		extendedMultiModelDTO["sigver"] = scenarioVerifierDTO;

		return extendedMultiModelDTO;
	}

	private configurationLoaded() {
		this._configurationLoaded.next(true);
	}

}
