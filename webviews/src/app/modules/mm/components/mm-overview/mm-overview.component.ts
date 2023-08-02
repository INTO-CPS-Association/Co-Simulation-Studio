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
    //FIXME MultiModelConfig is a non angular Class
    config!: MultiModelConfig;
    //FIXME WarningMessage is a non angular 
    warnings: WarningMessage[] = [];

    constructor(private zone: NgZone) {

    }

    parseConfig() {
        //FIXME IntoCpsApp is a non angular Class
        let project = IntoCpsApp.getInstance()?.getActiveProject();

        MultiModelConfig
            .parse(this.path, project?.getFmusPath() ?? "")
            .then(config => this.zone.run(() => { this.config = config; this.warnings = this.config.validate(); })).catch(err => console.log(err));
    }

    getOutputs() {
        //FIXME OutputConnectionsPair is a non angular Class
        let outputs: OutputConnectionsPair[] = [];

        this.config.fmuInstances.forEach(instance => {
            instance.outputsTo.forEach((connections, scalarVariable) => {
                //FIXME OutputConnectionsPair and Serializer is a non angular Class
                outputs.push(new OutputConnectionsPair(Serializer.getIdSv(instance, scalarVariable), connections));
            });
        });

        return outputs;
    }

    //FIXME ErrorMessages is a non angular 
    getWarnings() {
        return this.warnings.filter(w => !(w instanceof ErrorMessage));
    }

    //FIXME ErrorMessages is a non angular 
    getErrors() {
        return this.warnings.filter(w => w instanceof ErrorMessage);
    }

}
