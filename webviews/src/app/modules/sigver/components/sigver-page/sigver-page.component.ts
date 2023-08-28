import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SigverConfigurationService } from '../../services/sigver-configuration.service'; //FIXME Contains Non-angular interface
import { maestroVersions } from 'src/app/modules/shared/services/maestro-api.service';
import { CoSimulationStudioApi } from 'src/app/api';

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
		this.sigverConfigurationService.loadConfigurationFromPath()
			.then(async () => this.ensureResultPaths(await CoSimulationStudioApi.join(this.sigverConfigurationService.configurationPath, "..", "results", await CoSimulationStudioApi.sep())))
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

	async ensureResultPaths(rootResultsPath: string): Promise<void> {

		this.verificationResultsPath = await CoSimulationStudioApi.join(rootResultsPath, "verification");
		this.executionResultsPath = await CoSimulationStudioApi.join(rootResultsPath, "execution");
		this.generationResultsPath = await CoSimulationStudioApi.join(rootResultsPath, "generation");

		await this.ensureDirectoryExistence(this.verificationResultsPath);
		await this.ensureDirectoryExistence(this.executionResultsPath);
		await this.ensureDirectoryExistence(this.generationResultsPath);

	}

	async ensureDirectoryExistence(filePath: string): Promise<void> {

		if (await CoSimulationStudioApi.exists(filePath)) {
			return;
		}

		await CoSimulationStudioApi.mkdir(filePath, { recursive: true });

	}

}
