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

    //FIXME This is nonangular interface
    @Input()
    graph!: LiveGraph;

    //FIXME This is nonangular interface
    @Input()
    config!: CoSimulationConfig;

    //FIXME This seams to be unused
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

    //FIXME This is nonangular interface
    outputPorts: Array<InstanceScalarPair> = [];

    //FIXME This is need if the unused code above is needed
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

    //FIXME This uses nonangular interface
    getOutputs(scalarVariables: Array<ScalarVariable>) {
        return scalarVariables.filter(variable => (variable.causality === CausalityType.Output || variable.causality === CausalityType.Local));
    }

    //FIXME This uses nonangular interface
    isLocal(variable: ScalarVariable): boolean {
        return variable.causality === CausalityType.Local
    }

    //FIXME This uses nonangular interface
    getScalarVariableTypeName(type: ScalarVariableType) {
        return ScalarVariableType[type];
    }

    //FIXME This uses nonangular interface
    restrictToCheckedLiveStream(instance: Instance, scalarVariables: Array<ScalarVariable>) {
        return scalarVariables.filter(variable => this.isLivestreamChecked(instance, variable));
    }

    //FIXME This uses nonangular interface
    isLivestreamChecked(instance: Instance, output: ScalarVariable) {
        let variables = this.graph.getLivestream().get(instance);

        if (!variables) return false;

        return variables.indexOf(output) !== -1;
    }

    //FIXME This uses nonangular interface
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
