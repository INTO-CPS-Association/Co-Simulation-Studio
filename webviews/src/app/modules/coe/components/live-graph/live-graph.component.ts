import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CoSimulationConfig, LiveGraph } from 'src/app/modules/shared/classes/configuration/co-simulation-config';
import { InstanceScalarPair, ScalarVariable, CausalityType, ScalarVariableType, Instance } from 'src/app/modules/shared/classes/models/fmu';

@Component({
    selector: 'app-live-graph',
    templateUrl: './live-graph.component.html',
    styleUrls: ['./live-graph.component.scss']
})
export class LiveGraphComponent {

    @Input()
    graph!: LiveGraph;

    @Input()
    config!: CoSimulationConfig;

    /* set path(config: CoSimulationConfig) {
         this.config = config;
   
         if (config)
             this.parseconfig();
     }
     get path(): CoSimulationConfig {
         return this.config;
     }*/


    @Input()
    formGroup!: FormGroup;


    _editing: boolean = false;
    @Input()
    editing: boolean = false;


    outputPorts: Array<InstanceScalarPair> = [];

    /* parseconfig() {
         // Create an array of all output ports on all instances
         this.outputPorts = this.config.multiModel.fmuInstances
             .map(instance => instance.fmu.scalarVariables
                 .filter(sv => sv.type === ScalarVariableType.Real && (sv.causality === CausalityType.Output || sv.causality === CausalityType.Parameter))
                 .map(sv => this.config.multiModel.getInstanceScalarPair(instance.fmu.name, instance.name, sv.name)))
             .reduce((a, b) => a.concat(...b), []);
     }
   */
    liveStreamSearchName: string = '';

    customTrackBy(index: number, obj: any): any {
        return index;
    }

    getOutputs(scalarVariables: Array<ScalarVariable>) {
        return scalarVariables.filter(variable => (variable.causality === CausalityType.Output || variable.causality === CausalityType.Local));
    }

    isLocal(variable: ScalarVariable): boolean {
        return variable.causality === CausalityType.Local
    }

    getScalarVariableTypeName(type: ScalarVariableType) {
        return ScalarVariableType[type];
    }

    restrictToCheckedLiveStream(instance: Instance, scalarVariables: Array<ScalarVariable>) {
        return scalarVariables.filter(variable => this.isLivestreamChecked(instance, variable));
    }

    isLivestreamChecked(instance: Instance, output: ScalarVariable) {
        let variables = this.graph.getLivestream().get(instance);

        if (!variables) return false;

        return variables.indexOf(output) !== -1;
    }

    onLivestreamChange(enabled: boolean, instance: Instance, output: ScalarVariable) {
        let variables = this.graph.getLivestream().get(instance);

        if (!variables) {
            variables = [];
            this.graph.getLivestream().set(instance, variables);
        }

        if (enabled)
            variables.push(output);
        else {
            variables.splice(variables.indexOf(output), 1);

            if (variables.length == 0)
                this.graph.getLivestream().delete(instance);
        }
    }

    onLiveStreamKey(event: any) {
        this.liveStreamSearchName = event.target.value;
    }

}
