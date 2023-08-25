import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CoSimulationConfig, LiveGraph } from 'src/app/modules/shared/classes/co-simulation-config';
import { InstanceScalarPair, ScalarVariable, CausalityType, ScalarVariableType, Instance } from 'src/app/modules/shared/classes/fmu';
import textfieldcompoent from './textfieldcompoent';
import checkboxcompoent from './checkboxcomponent';

@Component({
    selector: 'app-live-graph',
    templateUrl: './live-graph.component.html',
    styleUrls: ['./live-graph.component.scss']
})
export class LiveGraphComponent {

    props = this
    textfieldcompoent_ = textfieldcompoent
    checkboxcomponent_ = checkboxcompoent
    //FIXME: This Uses a non Angular interface
    @Input()
    graph!: LiveGraph;

    //FIXME: This Uses a non Angular interface
    @Input()
    config!: CoSimulationConfig;

    //FIXME: This seams to not be used

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

    //FIXME: This Uses a non Angular interface
    outputPorts: Array<InstanceScalarPair> = [];

    //This is only need if the path is used

    /* parseconfig() {
         // Create an array of all output ports on all instances
         this.outputPorts = this.config.multiModel.fmuInstances
             .map(instance => instance.fmu.scalarVariables
                 .filter(sv => sv.type === ScalarVariableType.Real && (sv.causality === CausalityType.Output || sv.causality === CausalityType.Parameter))
                 .map(sv => this.config.multiModel.getInstanceScalarPair(instance.fmu.name, instance.name, sv.name)))
             .reduce((a, b) => a.concat(...b), []);
     }
   */

    

    customTrackBy(index: number, obj: any): any {
        return index;
    }

    //FIXME: This Uses a non Angular interface
    getOutputs(scalarVariables: Array<ScalarVariable>) {
        return scalarVariables.filter(variable => (variable.causality === CausalityType.Output || variable.causality === CausalityType.Local));
    }

    //FIXME: This Uses a non Angular interface
    isLocal(variable: ScalarVariable): boolean {
        return variable.causality === CausalityType.Local
    }

    setgraph_externalwindow(value: boolean){
        this.graph.externalWindow = value
    }

    //FIXME: This Uses a non Angular interface
    getScalarVariableTypeName(type: ScalarVariableType) {
        return ScalarVariableType[type];
    }

    //FIXME: This Uses a non Angular interface
    restrictToCheckedLiveStream(instance: Instance, scalarVariables: Array<ScalarVariable>) {
        return scalarVariables.filter(variable => this.isLivestreamChecked(instance, variable));
    }

    //FIXME: This Uses a non Angular interface
    isLivestreamChecked(instance: Instance, output: ScalarVariable) {
        let variables = this.graph.getLivestream().get(instance);

        if (!variables) return false;

        return variables.indexOf(output) !== -1;
    }

    //FIXME: This Uses a non Angular interface
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
    liveStreamSearchName: string = '';
    onLiveStreamKey(event: any) {
        this.liveStreamSearchName = event.target.value;
    }
    setlivestreamkey(x:string){
        this.liveStreamSearchName = x;
    }

}
