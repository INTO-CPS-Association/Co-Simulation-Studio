import React, { Component, useState } from 'react';

type LiveGraphComponent_prop = {
  graph: any
  config: any
  formGroup: any
  editing: boolean 
}

export const LiveGraphComponent: React.FunctionComponent<LiveGraphComponent_prop> = ({graph, config, formGroup, editing}) =>
{
    const [liveStreamSearchName, setLiveStreamSearchName] = useState('');
    
    const customTrackBy = (index: number, obj: any) => index;
    
    const getOutputs = (scalarVariables: any) => {
        return scalarVariables.filter(
            (variable: any) =>
                variable.causality === 'Output' || variable.causality === 'Local'
        );
    };
    
    const isLocal = (variable: any): boolean => {
        return variable.causality === 'Local';
    };
    
    const getScalarVariableTypeName = (type:any) => {
        //FIXME return ScalarVariableType[type];
        return type;
    };
    
    const restrictToCheckedLiveStream = (instance: any, scalarVariables: any) => {
        return scalarVariables.filter((variable: any) =>
            isLivestreamChecked(instance, variable)
        );
    };
    
    const isLivestreamChecked = (instance: any, output:any) => {
        let variables = graph.getLivestream().get(instance);
    
        if (!variables) return false;
    
        return variables.indexOf(output) !== -1;
    };
    
    const onLivestreamChange = (enabled: boolean, instance: any, output: any) => {
        let variables = graph.getLivestream().get(instance);
    
        if (!variables) {
            variables = [];
            graph.getLivestream().set(instance, variables);
        }
    
        if (enabled) variables.push(output);
        else {
            variables.splice(variables.indexOf(output), 1);
    
            if (variables.length === 0)
                graph.getLivestream().delete(instance);
        }
    };
    
    const onLiveStreamKey = (event: any) => {
        setLiveStreamSearchName(event.target.value);
    };
    
    return (
        <div>
        </div>
    );
};

export default LiveGraphComponent;
