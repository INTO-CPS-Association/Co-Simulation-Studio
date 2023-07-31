import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ErrorMessage, WarningMessage } from 'src/app/modules/shared/classes/configuration/messages';
import { MultiModelConfig } from 'src/app/modules/shared/classes/configuration/multi-model-config';
import { Serializer } from 'src/app/modules/shared/classes/configuration/parser';
import { OutputConnectionsPair } from 'src/app/modules/shared/classes/models/fmu';
import IntoCpsApp from 'src/app/modules/shared/classes/into-cps-app';

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

    parseConfig() {
        let project = IntoCpsApp.getInstance()?.getActiveProject();

        MultiModelConfig
            .parse(this.path, project?.getFmusPath() ?? "")
            .then(config => this.zone.run(() => { this.config = config; this.warnings = this.config.validate(); })).catch(err => console.log(err));
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
