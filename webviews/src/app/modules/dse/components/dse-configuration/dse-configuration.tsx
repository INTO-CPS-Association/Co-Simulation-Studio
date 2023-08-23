import React, { useState } from 'react';
import { PrimaryButton, DefaultButton, Dropdown, MessageBar, MessageBarType, Text } from '@fluentui/react';


export default function DseConfigurationReact(props: any) {
	return (
		<>
            
            {props.parseError && (
                <div className="alert alert-danger alert-big">
                    <Text>Error: Could not parse config.</Text>
                    <Text>Message: {props.parseError}</Text>
                    <Text>Path: {props.path}</Text>
                </div>
            )}

            <form className="form-horizontal" onSubmit={props.props.onSubmit}>
                {!props.editing && (
                    <PrimaryButton onClick={() => { props.editing = true }}>
                        Edit
                    </PrimaryButton>
                )}
                {props.editing && (
                    <PrimaryButton onClick={() => { props.editing = false }}>
                        Save
                    </PrimaryButton>
                )}

                <h3>Experiment Multi-model</h3>
                <div className="form-group">
                    <label style={{ textAlign: 'left' }} className="col-md-2 control-label">Co-simulation experiment</label>
                    <div className="col-md-9">
                        {!props.editing && <Text>{props.props.getMultiModelName()}</Text>}
                        {props.editing && (
                            <Dropdown
                                options={props.cosimConfig.map((con: any) => ({ key: con, text: props.props.experimentName(con) }))}
                                selectedKey={props.cosimConfig}
                                onChange={(event, item) => { props.props.onConfigChange(item) }}
                            />
                        )}
                    </div>
                </div>
                
                <h3>DSE Configuration Setup</h3>
                <h4>DSE Search Algorithms</h4>

                <div className="form-group">
                    <label className="col-sm-5 col-md-2 control-label">Search Algorithm</label>
                    <div className="col-sm-7 col-md-8">
                        {!props.editing && <Text>{props.config.searchAlgorithm.getName()}</Text>}
                        {props.editing && (
                            <Dropdown
                                id="selectalg"
                                options={props.algorithms.map((algorithm: any) => ({ key: algorithm.name, text: algorithm.name }))}
                                selectedKey={props.config.searchAlgorithm.getName()}
                                onChange={(event, item) => { props.props.onAlgorithmChange(item) }}
                            />
                        )}
                    </div>
                </div>

                {props.config.searchAlgorithm.getName() === 'Genetic' && (
                    <div className="form-horizontal">
                        <div className="form-group">
                            <label className="col-sm-5 col-md-4 control-label">Initial population</label>
                            <div className="col-sm-7 col-md-8">
                                {!props.editing && <Text>{props.config.searchAlgorithm.initialPopulation}</Text>}
                                {props.editing && (
                                    <input
                                        name="initialPopulation"
                                        value={props.config.searchAlgorithm.initialPopulation}
                                        onChange={e => { /* handler function for initialPopulation */ }}
                                        className="form-control"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-sm-5 col-md-4 control-label">Initial Population Distribution</label>
                            <div className="col-sm-7 col-md-8">
                                {!props.editing && <Text>{props.config.searchAlgorithm.initialPopulationDistribution}</Text>}
                                {props.editing && (
                                    <Dropdown
                                        options={props.geneticPopulationDistribution.map((pd: any) => ({ key: pd, text: pd }))}
                                        selectedKey={props.config.searchAlgorithm.initialPopulationDistribution}
                                        onChange={(event, item) => { /* handler function for initialPopulationDistribution */ }}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-sm-5 col-md-4 control-label">Mutation Probability</label>
                            <div className="col-sm-7 col-md-8">
                                {!props.editing && <Text>{props.config.searchAlgorithm.mutationProbability}</Text>}
                                {props.editing && (
                                    <input
                                        name="mutationProbability"
                                        value={props.config.searchAlgorithm.mutationProbability}
                                        onChange={e => { /* handler function for mutationProbability */ }}
                                        className="form-control"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}

            
            <h4>Experiment parameters</h4>

            {props.config.multiModel && (
                <div className="row">
                    <div className="col-md-4">
                        <h5><label>Instance</label></h5>

                        <ul className="list-group">
                            {props.config.multiModel.fmuInstances.map((instance: any) => (
                                <li 
                                    key={instance.name} 
                                    onClick={() => props.props.selectParameterInstance(instance)}
                                    className={`list-group-item ${props.selectedParameterInstance === instance ? 'active' : ''}`}
                                >
                                    {instance.fmu.name}.{instance.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-6">
                                <h5><label>Parameters</label></h5>
                            </div>
                            {props.selectedParameterInstance && props.editing && (
                                <div className="col-md-6">
                                    {/* Fluent UI Dropdown component can be used here */}
                                    <Dropdown 
                                        options={props.props.getParameters().map((parameter: any) => ({ key: parameter.name, text: parameter.name }))}
                                        selectedKey={props.newParameter}
                                        onChange={(event, item) => { /* handle new parameter selection */ }}
                                    />
                                    <DefaultButton onClick={props.addParameter}>
                                        Add DSE parameter
                                    </DefaultButton>
                                </div>
                            )}
                        </div>

                        {props.selectedParameterInstance && (
                            props.props.getInitialValues().map((initialValue :any, index:any) => (
                                <div key={index} className="row">
                                    {/* ... (similar translation pattern for each initialValue) ... */}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <hr />

            <h4>
                Parameter Constraints
                {props.editing && (
                    <DefaultButton id="AddConstraints" onClick={props.addParameterConstraint}>
                        <span className="glyphicon glyphicon-plus"></span> Add Constraint
                    </DefaultButton>
                )}
            </h4>

            {props.config.paramConst.map((p:any, i:any) => (
                <div key={i} className="row">
                    <div className="col-md-6">
                        {!props.editing && <p className="form-control-static">{props.props.getParameterConstraint(p)}</p>}
                        {props.editing && (
                            <input 
                                id={`conparameter${i}`} 
                                value={props.props.getParameterConstraint(p)}
                                onChange={e => props.props.setParameterConstraint(p, e.target.value)}
                                className="form-control" 
                                style={{ width: '80%' }}
                            />
                        )}
                    </div>
                    <div className="col-md-1">
                        {props.editing && (
                            <DefaultButton onClick={() => props.props.removeParameterConstraint(p)}>
                                <span className="glyphicon glyphicon-remove"></span> Remove Constraint
                            </DefaultButton>
                        )}
                    </div>
                </div>
            ))}

            <hr />
            <h4>
                External Script Objectives
                {props.editing && (
                    <DefaultButton onClick={props.addExternalScript}>
                        <span className="glyphicon glyphicon-plus"></span> Add External Script Objective
                    </DefaultButton>
                )}
            </h4>

            <div className="row">
                <div className="col-md-2"><label>Objective Name</label></div>
                <div className="col-md-2"><label>File Name</label></div>
                <div className="col-md-8"><label>Arguments</label></div>
            </div>

            {props.config.extScrObjectives.map((e: any) => (
                <div key={props.props.getExternalScriptName(e)} className="row">
                    <div className="col-md-2">
                        {!props.editing && <p className="form-control-static">{props.props.getExternalScriptName(e)}</p>}
                        {props.editing && (
                            <input 
                                value={props.props.getExternalScriptName(e)}
                                onChange={event => props.props.setExternalScriptName(e, event.target.value)}
                                className="form-control input-fixed-size input-sm"
                                style={{ width: '100%' }}
                            />
                        )}
                        {props.editing && (
                            <DefaultButton onClick={() => props.props.removeExternalScript(e)}>
                                <span className="glyphicon glyphicon-remove"></span> Remove External Script
                            </DefaultButton>
                        )}
                    </div>
                    {/* ... (similar translation pattern for File Name, Arguments, etc.) ... */}
                </div>
            ))}

            <hr />

            <h4>
                Internal Function Objectives
                {props.editing && (
                    <DefaultButton onClick={props.addInternalFunction}>
                        <span className="glyphicon glyphicon-plus"></span> Add Internal Function Objective
                    </DefaultButton>
                )}
            </h4>

            <div className="row">
                <div className="col-md-3"><label>Objective Name</label></div>
                <div className="col-md-4"><label>Output ID</label></div>
                <div className="col-md-3"><label>Objective Type</label></div>
            </div>

            {props.config.intFunctObjectives.map((i:any) => (
                <div key={props.props.getExternalScriptName(i)} className="row">
                    <div className="col-md-3">
                        {!props.editing && <p className="form-control-static">{props.props.getExternalScriptName(i)}</p>}
                        {props.editing && (
                            <input 
                                value={props.props.getExternalScriptName(i)}
                                onChange={event => props.props.setExternalScriptName(i, event.target.value)}
                                className="form-control input-fixed-size input-sm"
                                style={{ width: '100%' }}
                            />
                        )}
                        {props.editing && (
                            <DefaultButton onClick={() => props.props.removeInternalFunction(i)}>
                                <span className="glyphicon glyphicon-remove"></span> Remove Internal Function Objective
                            </DefaultButton>
                        )}
                    </div>
                    <div className="col-md-4">
                        {!props.editing && <p className="form-control-static">{props.props.getInternalFunctionColumnName(i)}</p>}
                        {props.editing && (
                            <Dropdown 
                                options={props.mmOutputs.map((mmout:any) => ({ key: mmout, text: mmout }))}
                                selectedKey={props.props.getInternalFunctionColumnName(i)}
                                onChange={(event, item) => props.props.setInternalFunctionColumnName(i, item)}
                            />
                        )}
                    </div>
                    <div className="col-md-3">
                        {!props.editing && <p className="form-control-static">{props.props.getInternalFunctionObjectiveType(i)}</p>}
                        {props.editing && (
                            <Dropdown 
                                options={props.internalFunctionTypes.map((ift:any) => ({ key: ift, text: ift }))}
                                selectedKey={props.props.getInternalFunctionObjectiveType(i)}
                                onChange={(event, item) => props.props.setInternalFunctionObjectiveType(i, item)}
                            />
                        )}
                    </div>
                </div>
            ))}

            <hr />

            <h4>
                Objective Constraints
                {props.editing && (
                    <DefaultButton onClick={props.addObjectiveConstraint}>
                        <span className="glyphicon glyphicon-plus"></span> Add Constraint
                    </DefaultButton>
                )}
            </h4>

            {props.config.objConst.map((o:any) => (
                <div key={props.props.getObjectiveConstraint(o)} className="row">
                    <div className="col-md-6">
                        {!props.editing && <p className="form-control-static">{props.props.getObjectiveConstraint(o)}</p>}
                        {props.editing && (
                            <input 
                                value={props.props.getObjectiveConstraint(o)}
                                onChange={event => props.props.setObjectiveConstraint(o, event.target.value)}
                                className="form-control input-fixed-size input-sm"
                                style={{ width: '80%' }}
                            />
                        )}
                    </div>
                    <div className="col-md-1">
                        {props.editing && (
                            <DefaultButton onClick={() => props.props.removeObjectiveConstraint(o)}>
                                <span className="glyphicon glyphicon-remove"></span> Remove Constraint
                            </DefaultButton>
                        )}
                    </div>
                </div>
            ))}

            <hr />

            </form>
        </>
	);
}