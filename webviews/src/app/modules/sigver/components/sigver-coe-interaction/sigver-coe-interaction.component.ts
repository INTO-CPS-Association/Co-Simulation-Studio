import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { CoSimulationStudioApi } from 'src/app/api';
import { MaestroApiService, maestroVersions } from 'src/app/modules/shared/services/maestro-api.service';
import { SigverConfigurationService } from '../../services/sigver-configuration.service';

@Component({
	selector: 'app-sigver-coe-interaction',
	templateUrl: './sigver-coe-interaction.component.html',
	styleUrls: ['./sigver-coe-interaction.component.scss']
})
export class SigverCoeInteractionComponent {

	_configurationChangedSub: Subscription;
	_coeIsOnlineSub: Subscription;

	videoUrl: any;

	@Input()
	generationresultspath: string = "";

	@Input()
	verificationresultspath: string = "";

	verificationErrMsg: string = "";

	// View state bools
	isVerificationFailed: boolean = false;
	isCoeOnline: boolean = false;
	isGeneratingTraces: boolean = false;
	isMasterModelValid: boolean = false;
	isVerified: boolean = false;
	isGeneratingMasterModel: boolean = false;
	isVerifying: boolean = false;

	constructor(public maestroApiService: MaestroApiService, private sanitizer: DomSanitizer, public sigverConfigurationService: SigverConfigurationService) {
		this._coeIsOnlineSub = this.maestroApiService.startMonitoringOnlineStatus(
			async (isOnline) => (this.isCoeOnline = isOnline && (await maestroApiService.getMaestroVersion()) == maestroVersions.maestroV2)
		);
		this._configurationChangedSub = this.sigverConfigurationService.configurationChangedObservable.subscribe(() => {
			this.handleConfigurationChanges();
		});
	}

	ngOnDestroy(): void {
		this.maestroApiService.stopMonitoringOnlineStatus(this._coeIsOnlineSub);
		this._configurationChangedSub.unsubscribe();
	}

	onGenerateMasterModelClick() {
		this.isGeneratingMasterModel = true;
		this.maestroApiService
			.generateScenario(this.sigverConfigurationService.configurationToExtendedMultiModelDTO())
			.then(
				(masterModelFile) => {
					masterModelFile.text().then((masterModel) => {
						this.sigverConfigurationService.configuration.masterModel = masterModel;
						this.sigverConfigurationService.configurationChanged();
						this.sigverConfigurationService.saveConfiguration();
						this.isMasterModelValid = true;
					});
					this.writeFileToDir(masterModelFile, this.generationresultspath);
				},
				(errMsg) => {
					console.error(`Error occurred when generating the master model: ${errMsg}`);
				}
			)
			.finally(() => {
				this.isGeneratingMasterModel = false;
			});
	}

	onVerifyClick() {
		this.isVerifying = true;
		this.maestroApiService
			.verifyAlgorithm(this.sigverConfigurationService.configuration.masterModel)
			.then(
				(res) => {
					this.isVerified = true;
					this.isVerificationFailed = !res.verifiedSuccessfully;
					if (this.isVerificationFailed) {
						this.verificationErrMsg = res.errorMessage;
					}
					const blob = new Blob([res.uppaalModel], { type: "text/plain" });
					const uppaalFile = new File([blob], "uppaalModel.xml", {
						type: blob.type,
					});
					this.writeFileToDir(uppaalFile, this.verificationresultspath);
				},
				(errMsg) => {
					console.error(`Error occurred when verifying the master model: ${errMsg}`);
				}
			)
			.finally(() => {
				this.isVerifying = false;
			});
	}

	onVisualizeTracesClick() {
		this.isGeneratingTraces = true;
		this.maestroApiService
			.visualizeTrace(this.sigverConfigurationService.configuration.masterModel)
			.then(
				(videoFile) => {
					this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(videoFile));
					this.writeFileToDir(videoFile, this.verificationresultspath);
				},
				(errMsg) => {
					console.error(`Error occurred when visualizing traces: ${errMsg}`);
				}
			)
			.finally(() => (this.isGeneratingTraces = false))
			.finally(() => {
				this.isGeneratingTraces = false;
			});
	}

	handleConfigurationChanges() {
		this.isMasterModelValid = this.sigverConfigurationService.configuration.masterModel != "";
		this.isVerified = this.isMasterModelValid && this.isVerified;
		this.isVerificationFailed = this.isVerified ? this.isVerificationFailed : false;
		if (!this.isVerificationFailed) {
			this.videoUrl = null;
		}
	}

	async writeFileToDir(file: File, dirPath: string): Promise<void> {
		try {
		const filePath = await CoSimulationStudioApi.join(dirPath, file.name);
		await CoSimulationStudioApi.writeFile(filePath, new TextDecoder("utf-8").decode(await file.arrayBuffer()));
		} catch (e) {
			throw new Error(`Error occurred when writing file to path ${dirPath}: ${e}`);
		}
	}

}
