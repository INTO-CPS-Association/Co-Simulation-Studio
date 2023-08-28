import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ErrorMessage, WarningMessage } from 'src/app/modules/shared/classes/messages';
import { MultiModelConfig } from 'src/app/modules/shared/classes/multi-model-config';
import { Serializer } from 'src/app/modules/shared/classes/parser';
import { OutputConnectionsPair } from 'src/app/modules/shared/classes/fmu';
import { CoSimulationStudioApi } from 'src/app/api';

@Component({
    selector: 'app-mm-overview',
    templateUrl: './mm-overview.component.html',
    styleUrls: ['./mm-overview.component.scss']
})
export class MmOverviewComponent {

    _path!: string;

    @Input()
    set path(path: string) {
        this._path = path;
        if (path)
            this.parseConfig();
    }

    get path(): string {
        return this._path;
    }

    config!: MultiModelConfig;
    warnings: WarningMessage[] = [];

    constructor(private zone: NgZone) {
    }

    async parseConfig() {
        const config = await MultiModelConfig.parse(this.path, await CoSimulationStudioApi.getFmusPath());
        this.zone.run(() => {
            this.config = config;
            this.warnings = this.config.validate();
        });
    }

    getOutputs() {
        let outputs: OutputConnectionsPair[] = [];
        this.config.fmuInstances.forEach(instance => {
            instance.outputsTo.forEach((connections, scalarVariable) => {
                outputs.push(new OutputConnectionsPair(Serializer.getIdSv(instance, scalarVariable), connections));
            });
        });
        return outputs;
    }

    getWarnings() {
        return this.warnings.filter(w => !(w instanceof ErrorMessage));
    }

    getErrors() {
        return this.warnings.filter(w => w instanceof ErrorMessage);
    }

}
