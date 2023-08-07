import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as Path from "path";
import * as Fs from "fs"; //FIXME Non-angular interface
import { SigverConfigurationService } from '../../services/sigver-configuration.service'; //FIXME Contains Non-angular interface
import { maestroVersions } from 'src/app/modules/shared/services/maestro-api.service';

@Component({
	selector: 'app-sigver-page',
	templateUrl: './sigver-page.component.html',
	styleUrls: ['./sigver-page.component.scss']
})
export class SigverPageComponent {

	_configurationChangedSub: Subscription;
	_path: string = "";
	masterModel: string = "";
	cosConfPath: string = "";
	generationResultsPath: string = "";
	verificationResultsPath: string = "";
	executionResultsPath: string = "";
	disableSimulationBtn: boolean = true;
	requiredMaestroVersion: maestroVersions = maestroVersions.maestroV2;

	@Input()
	set path(path: string) {
		this._path = path;
		this.sigverConfigurationService.configurationPath = this._path;
		this.sigverConfigurationService
			.loadConfigurationFromPath() //FIXME this function relies on Non-angular interface (fs) from '../../services/sigver-configuration.service'
			.then(() => this.ensureResultPaths(Path.join(this.sigverConfigurationService.configurationPath, "..", "results", Path.sep)))
			.catch((err) => console.error(err));
	}
	get path(): string {
		return this._path;
	}

	constructor(public sigverConfigurationService: SigverConfigurationService) {
		this._configurationChangedSub = this.sigverConfigurationService.configurationChangedObservable.subscribe(() => {
			this.cosConfPath = sigverConfigurationService.configuration.coePath;
			this.masterModel = sigverConfigurationService.configuration.masterModel;
			this.disableSimulationBtn = this.masterModel == "";
		});
	}

	ngOnDestroy(): void {
		this._configurationChangedSub.unsubscribe();
	}

	ensureResultPaths(rootResultsPath: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.verificationResultsPath = Path.join(rootResultsPath, "verification");
			this.executionResultsPath = Path.join(rootResultsPath, "execution");
			this.generationResultsPath = Path.join(rootResultsPath, "generation");

			Promise.all([
				this.ensureDirectoryExistence(this.verificationResultsPath).catch((err) => reject(err)),
				this.ensureDirectoryExistence(this.executionResultsPath).catch((err) => reject(err)),
				this.ensureDirectoryExistence(this.generationResultsPath).catch((err) => console.log(err)),
			])
				.then(() => resolve())
				.catch((err) => reject(err));
		});
	}

	ensureDirectoryExistence(filePath: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if (Fs.existsSync(filePath)) { //FIXME Non-angular interface
				resolve();
			}
			Fs.promises.mkdir(filePath, { recursive: true }).then( //FIXME Non-angular interface
				() => {
					resolve();
				},
				(err) => {
					reject(err);
				}
			);
		});
	}

}
