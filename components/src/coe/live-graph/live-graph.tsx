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
      <div className="form-horizontal" //FIXMEformGroup={formGroup}
      >
      <div className="form-group">
        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-5 col-md-4 control-label">Name:</label>
            <p className="form-control-static col-sm-7 col-md-8">{editing ? graph.title : ''}</p>
            {editing && (
              <input
                className="form-control col-sm-7 col-md-8"
                name="title"
                value={graph.title}
                //onChange={(e) => this.onTitleChange(e.target.value)}
              />
            )}
          </div>
          <div className="form-group">
            <label className="col-sm-5 col-md-4 control-label">External Window</label>
            <div className="checkbox col-sm-7 col-md-8">
              <label>
                <input
                  name="externalWindow"
                  type="checkbox"
                  disabled={!editing}
                  checked={graph.externalWindow}
                  //onChange={(e) => this.onExternalWindowChange(e.target.checked)}
                />
              </label>
            </div>
          </div>
          
          {config.multiModel.fmuInstances.map((instance: any, index: number) => ( //FIXME fmuinstances not defined
            <div className="form-group" key={index}>
              <label className="col-sm-5 col-md-4 control-label">
                {instance.fmu.name}.{instance.name}
              </label>
              <div className="col-sm-7 col-md-8">
                {editing
                  ? getOutputs(instance.fmu.scalarVariables).map((output: any, outIndex: number) => (
                      <div className="checkbox" key={outIndex}>
                        <label>
                          <span
                            className={isLocal(output) ? 'text-warning' : ''}
                            title={`Name: ${output.name}, Causality: ${output.causality}, Type: ${getScalarVariableTypeName(output.type)}`}
                          >
                            {output.name}
                          </span>
                        </label>
                      </div>
                    ))
                  : restrictToCheckedLiveStream(instance, getOutputs(instance.fmu.scalarVariables)).map((output: any, outIndex: number) => (
                      <div className="checkbox" key={outIndex}>
                        <label>
                          <span
                            className={isLocal(output) ? 'text-warning' : ''}
                            title={`Name: ${output.name}, Causality: ${output.causality}, Type: ${getScalarVariableTypeName(output.type)}`}
                          >
                            {output.name}
                          </span>
                        </label>
                      </div>
                    ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveGraphComponent;
