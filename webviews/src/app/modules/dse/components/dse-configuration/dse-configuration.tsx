import React, { useState, Component } from 'react';
import { PrimaryButton, DefaultButton, Dropdown, MessageBar, MessageBarType, Text } from '@fluentui/react';


export class DseConfigurationReact extends React.Component{
    constructor(props: any){
        super(props);
    }

    override state = {
        props: this.props as any,
        reload: false,
    };

    editing = this.state.props.editing;
    
    refreshPage = () => {
    this.setState({reload: true},
        () => this.setState({reload: false, hello: 'denmark'})
    )
    }

    override render(): React.ReactNode {
        return (
            <>
                {this.state.props.parseError && (
                    <div className="alert alert-danger alert-big">
                        <Text>Error: Could not parse config.</Text>
                        <Text>Message: {this.state.props.parseError}</Text>
                        <Text>Path: {this.state.props.path}</Text>
                    </div>
                )}
                <form className="form-horizontal" onSubmit={this.state.props.props.onSubmit()}>
                    {!this.editing && (
                        <DefaultButton onClick={() => {this.editing = true; this.refreshPage();}}>
                            <span className="glyphicon glyphicon-edit" aria-hidden="true"></span> Edit  
                        </DefaultButton>
                    )}
                    {this.editing && (
                        <DefaultButton onClick={() => {this.editing = false; this.refreshPage();}}>
                            <span className="glyphicon glyphicon-floppy-saved" aria-hidden="true"></span> Save
                        </DefaultButton>
                    )}

                
                    <h3>Experiment Multi-model</h3>
                    {/* //FIXME Not test no input*/}
                    <div className="form-group">
                        <label style={{ textAlign: 'left' }} className="col-md-2 control-label">Co-simulation experiment</label>
                        <div className="col-md-9">
                            {!this.editing && <Text>{this.state.props.props.getMultiModelName()}</Text>}
                            {this.editing && (
                                <Dropdown
                                    options={this.state.props.cosimConfig.map((con: any) => ({ key: con, text: this.state.props.props.experimentName(con) }))}
                                    selectedKey={this.state.props.cosimConfig}
                                    onChange={(event, item) => {this.state.props.props.onConfigChange(item); this.refreshPage();}}
                                />
                            )}
                        </div>
                    </div>
                    
                    <h3>DSE Configuration Setup</h3>
                    <h4>DSE Search Algorithms</h4>
                    {/* //FIXME Not test no input*/}
                    <div className="form-group">
                        <label style={{ textAlign: 'left' }} className="col-sm-5 col-md-2 control-label">Search Algorithm</label>
                        <div className="col-sm-7 col-md-8">
                            {!this.editing && <Text>{this.state.props.config.searchAlgorithm.getName()}</Text>}
                            {this.editing && (
                                <Dropdown
                                    id="selectalg"
                                    options={this.state.props.algorithms.map((algorithm: any) => ({ key: algorithm.name, text: algorithm.name }))}
                                    selectedKey={this.state.props.config.searchAlgorithm.getName()}
                                    onChange={(event, item) => {this.state.props.props.onAlgorithmChange(item); this.refreshPage();}}
                                />
                            )}
                        </div>
                    </div>
                    {/* //FIXME Not test no input*/}
                    {this.state.props.config.searchAlgorithm.getName() === 'Genetic' && (
                        <div className="form-horizontal">
                            <div className="form-group">
                                <label className="col-sm-5 col-md-4 control-label">Initial population</label>
                                <div className="col-sm-7 col-md-8">
                                    {!this.editing && <Text>{this.state.props.config.searchAlgorithm.initialPopulation}</Text>}
                                    {this.editing && (
                                        <input
                                            name="initialPopulation"
                                            value={this.state.props.config.searchAlgorithm.initialPopulation}
                                            onChange={e => { /* handler function for initialPopulation */ }}
                                            className="form-control"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="col-sm-5 col-md-4 control-label">Initial Population Distribution</label>
                                <div className="col-sm-7 col-md-8">
                                    {!this.editing && <Text>{this.state.props.config.searchAlgorithm.initialPopulationDistribution}</Text>}
                                    {this.editing && (
                                        <Dropdown
                                            options={this.state.props.geneticPopulationDistribution.map((pd: any) => ({ key: pd, text: pd }))}
                                            selectedKey={this.state.props.config.searchAlgorithm.initialPopulationDistribution}
                                            onChange={(event, item) => { /* handler function for initialPopulationDistribution */ }}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="col-sm-5 col-md-4 control-label">Mutation Probability</label>
                                <div className="col-sm-7 col-md-8">
                                    {!this.editing && <Text>{this.state.props.config.searchAlgorithm.mutationProbability}</Text>}
                                    {this.editing && (
                                        <input
                                            name="mutationProbability"
                                            value={this.state.props.config.searchAlgorithm.mutationProbability}
                                            onChange={e => { /* handler function for mutationProbability */ }}
                                            className="form-control"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                <hr />
                
                <h4>Experiment parameters</h4>
                {/* //FIXME Not test no input*/}
                {this.state.props.config.multiModel && (
                    <div className="row">
                        <div className="col-md-4">
                            <h5><label>Instance</label></h5>

                            <ul className="list-group">
                                {this.state.props.config.multiModel.fmuInstances.map((instance: any) => (
                                    <li 
                                        key={instance.name} 
                                        onClick={() => this.state.props.props.selectParameterInstance(instance)}
                                        className={`list-group-item ${this.state.props.selectedParameterInstance === instance ? 'active' : ''}`}
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
                                {this.state.props.selectedParameterInstance && this.editing && (
                                    <div className="col-md-6">
                                        {/* Fluent UI Dropdown component can be used here */}
                                        <Dropdown 
                                            options={this.state.props.props.getParameters().map((parameter: any) => ({ key: parameter.name, text: parameter.name }))}
                                            selectedKey={this.state.props.newParameter}
                                            onChange={(event, item) => { /* handle new parameter selection */ }}
                                        />
                                        <DefaultButton onClick={() => {this.state.props.addParameter; this.refreshPage();}}>
                                            Add DSE parameter
                                        </DefaultButton>
                                    </div>
                                )}
                            </div>

                            {this.state.props.selectedParameterInstance && (
                                this.state.props.props.getInitialValues().map((initialValue :any, index:any) => (
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
                    {this.editing && (
                        <DefaultButton id="AddConstraints" onClick={() => {this.state.props.props.addParameterConstraint(); this.refreshPage();}}>
                            <span className="glyphicon glyphicon-plus"></span> Add Constraint
                        </DefaultButton>
                    )}
                </h4>
                {/* //FIXME error in this.state.props.props.getParameterConstraint(p) and this.state.props.props.setParameterConstraint that provents this.refreshPage();*/}
                {this.state.props.config.paramConst.map((p:any, i:any) => (
                    <div key={i} className="row">
                        <div className="col-md-6">
                            {!this.editing && <p className="form-control-static">{this.state.props.props.getParameterConstraint(p)}</p>}
                            {this.editing && (
                                <input 
                                    id={`conparameter${i}`} 
                                    value={this.state.props.props.getParameterConstraint(p)}
                                    onChange={event => {this.state.props.props.setParameterConstraint(p, event.target.value); this.refreshPage();}}
                                    className="form-control" 
                                    style={{ width: '80%' }}
                                />
                            )}
                        </div>
                        <div className="col-md-1">
                            {this.editing && (
                                <DefaultButton onClick={() => {this.state.props.props.removeParameterConstraint(p); this.refreshPage();}}>
                                    <span className="glyphicon glyphicon-remove"></span> Remove Constraint
                                </DefaultButton>
                            )}
                        </div>
                    </div>
                ))}

                <hr />
                <h4>
                    External Script Objectives
                    {this.editing && (
                        <DefaultButton onClick={() => {this.state.props.props.addExternalScript(); this.refreshPage();}}>
                            <span className="glyphicon glyphicon-plus"></span> Add External Script Objective
                        </DefaultButton>
                    )}
                </h4>

                <div className="row">
                    <div className="col-md-2"><label>Objective Name</label></div>
                    <div className="col-md-2"><label>File Name</label></div>
                    <div className="col-md-8"><label>Arguments</label></div>
                </div>
                {/*//FIXME adding multiple looks wrong*/}
                {this.state.props.config.extScrObjectives.map((e: any, i:any) => (
                    <><div key={i} className="row">
                        <div className="col-md-2">
                            {!this.editing && <p className="form-control-static">{this.state.props.props.getExternalScriptName(e)}</p>}
                            {this.editing && (
                                <input
                                    id={`conparameter${i}`}
                                    value={this.state.props.props.getExternalScriptName(e)}
                                    onChange={event => { this.state.props.props.setExternalScriptName(e, event.target.value); this.refreshPage(); } }
                                    className="form-control form-control input-fixed-size input-sm"
                                    style={{ width: '100%' }} />
                            )}
                            {this.editing && (
                                <DefaultButton onClick={() => { this.state.props.props.removeExternalScript(e); this.refreshPage(); } }>
                                    <span className="glyphicon glyphicon-remove"></span> Remove External Script
                                </DefaultButton>
                            )}
                        </div>
                        <div className="col-md-2">
                            {!this.editing && <p className="form-control-static">{this.state.props.props.getExternalScriptFilename(e)}</p>}
                            {this.editing && (
                                <input
                                    id={`fileparameter${i}`}
                                    value={this.state.props.props.getExternalScriptFilename(e)}
                                    onChange={event => { this.state.props.props.setExternalScriptFileName(e, event.target.value); this.refreshPage(); } }
                                    className="form-control form-control input-fixed-size input-sm"
                                    style={{ width: '100%' }} />
                            )}
                        </div>
                        {/*//FIXME Not test*/}
                        </div><div className="col-md-8">
                                {this.state.props.props.getExternalScriptParameters(e).map((p: any, j: any) => (
                                    <div key={j} className="row">
                                        <div className="col-md-1">
                                            {!this.editing && <p className="form-control-static">{p.id}</p>}
                                            {this.editing && (
                                                <input
                                                    value={p.id}
                                                    onChange={event => this.state.props.props.setExternalScriptParameterId(e, p, event.target.value)}
                                                    className="form-control input-fixed-size input-sm"
                                                    style={{ width: '40px' }} />
                                            )}
                                        </div>
                                        <div className="col-md-3">
                                            {!this.editing && <p className="form-control-static">{p.type}</p>}
                                            {this.editing && (
                                                <select
                                                    value={p.type}
                                                    onChange={event => this.state.props.props.setExternalScriptParameterType(e, p, event.target.value)}
                                                    className="form-control input-sm"
                                                    style={{ width: '100%' }}
                                                >
                                                    {this.state.props.props.externalScriptParamTp.map((paramTp: string) => (
                                                        <option key={paramTp} value={paramTp}>{paramTp}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                        <div className="col-md-4">
                                            {!this.editing && <p className="form-control-static">{p.value}</p>}
                                            {this.editing && p.type === 'constant' && (
                                                <input 
                                                    value={p.value} 
                                                    onChange={event => this.state.props.props.setExternalScriptParameterValue(e, p, event.target.value)} 
                                                    className="form-control input-fixed-size input-sm"
                                                />
                                            )}
                                            {this.editing && p.type === 'simulation value' && (
                                                <select 
                                                    value={p.value} 
                                                    onChange={event => this.state.props.props.setExternalScriptParameterValue(e, p, event.target.value)} 
                                                    className="form-control"
                                                >
                                                    {this.state.props.props.simulationValue.map((simVal: string) => (
                                                        <option key={simVal} value={simVal}>{simVal}</option>
                                                    ))}
                                                </select>
                                            )}
                                            {this.editing && p.type === 'model output' && (
                                                <select 
                                                    value={p.value} 
                                                    onChange={event => this.state.props.props.setExternalScriptParameterValue(e, p, event.target.value)} 
                                                    className="form-control"
                                                >
                                                    {this.state.props.props.mmOutputs.map((mmout: string) => (
                                                        <option key={mmout} value={mmout}>{mmout}</option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div></> 
                ))}

                                

                <hr />

                <h4>
                    Internal Function Objectives
                    {this.editing && (
                        <DefaultButton onClick={() => {this.state.props.props.addInternalFunction(); this.refreshPage();}}>
                            <span className="glyphicon glyphicon-plus"></span> Add Internal Function Objective
                        </DefaultButton>
                    )}
                </h4>

                <div className="row">
                    <div className="col-md-3"><label>Objective Name</label></div>
                    <div className="col-md-4"><label>Output ID</label></div>
                    <div className="col-md-3"><label>Objective Type</label></div>
                </div>
                {/*//FIXME Not testted since addInternalFunction() dosent do enything*/}
                {this.state.props.config.intFunctObjectives.map((i:any) => (
                    <div key={this.state.props.props.getExternalScriptName(i)} className="row">
                        <div className="col-md-3">
                            {!this.editing && <p className="form-control-static">{this.state.props.props.getExternalScriptName(i)}</p>}
                            {this.editing && (
                                <input 
                                    value={this.state.props.props.getExternalScriptName(i)}
                                    onChange={event => {this.state.props.props.setExternalScriptName(i, event.target.value); this.refreshPage();}}
                                    className="form-control input-fixed-size input-sm"
                                    style={{ width: '100%' }}
                                />
                            )}
                            {this.editing && (
                                <DefaultButton onClick={() => {this.state.props.props.removeInternalFunction(i); this.refreshPage();}}>
                                    <span className="glyphicon glyphicon-remove"></span> Remove Internal Function Objective
                                </DefaultButton>
                            )}
                        </div>
                        <div className="col-md-4">
                            {!this.editing && <p className="form-control-static">{this.state.props.props.getInternalFunctionColumnName(i)}</p>}
                            {this.editing && (
                                <Dropdown 
                                    options={this.state.props.mmOutputs.map((mmout:any) => ({ key: mmout, text: mmout }))}
                                    selectedKey={this.state.props.props.getInternalFunctionColumnName(i)}
                                    onChange={(event, item) => {this.state.props.props.setInternalFunctionColumnName(i, item); this.refreshPage();}}
                                />
                            )}
                        </div>
                        <div className="col-md-3">
                            {!this.editing && <p className="form-control-static">{this.state.props.props.getInternalFunctionObjectiveType(i)}</p>}
                            {this.editing && (
                                <Dropdown 
                                    options={this.state.props.internalFunctionTypes.map((ift:any) => ({ key: ift, text: ift }))}
                                    selectedKey={this.state.props.props.getInternalFunctionObjectiveType(i)}
                                    onChange={(event, item) => {this.state.props.props.setInternalFunctionObjectiveType(i, item); this.refreshPage();}}
                                />
                            )}
                        </div>
                    </div>
                ))}

                <hr />

                <h4>
                    Objective Constraints
                    {this.editing && (
                        <DefaultButton onClick={()=> {this.state.props.props.addObjectiveConstraint(); this.refreshPage();}}>
                            <span className="glyphicon glyphicon-plus"></span> Add Constraint
                        </DefaultButton>
                    )}
                </h4>
                {/* //FIXME error in this.state.props.props.addObjectiveConstraint(p) and this.state.props.props.addObjectiveConstraint that provents this.refreshPage();*/}
                {this.state.props.config.objConst.map((o:any, i:any) => (
                    <div key={i} className="row">
                        <div className="col-md-6">
                            {!this.editing && <p className="form-control-static">{this.state.props.props.getObjectiveConstraint(o)}</p>}
                            {this.editing && (
                                <input 
                                    id={`conparameter${i}`} 
                                    value={this.state.props.props.getObjectiveConstraint(o)}
                                    onChange={event => {this.state.props.props.setObjectiveConstraint(o, event.target.value); this.refreshPage();}}
                                    className="form-control input-fixed-size input-sm"
                                    style={{ width: '80%' }}
                                />
                            )}
                        </div>
                        <div className="col-md-1">
                            {this.editing && (
                                <DefaultButton onClick={() => {this.state.props.props.removeObjectiveConstraint(o); this.refreshPage();}}>
                                    <span className="glyphicon glyphicon-remove"></span> Remove Constraint
                                </DefaultButton>
                            )}
                        </div>
                    </div>
                ))}

                <hr />

                <h4>Ranking</h4>

                <div className="row">
                    <div className="col-md-3"><label>Ranking Method</label></div>
                    {this.state.props.props.getRankingMethod() === 'Pareto' && <div className="col-md-7"><label>Dimensions</label></div>}
                </div>
 
                <div className="row">
                    <div className="col-md-3">
                        {this.state.props.props.getRankingMethod()}
                        {this.editing && this.state.props.props.getRankingMethod() === 'Pareto' && (
                            <DefaultButton onClick={() => {this.state.props.props.addParetoDimension('', ''); this.refreshPage();}}>
                                <span className="glyphicon glyphicon-plus"></span> Add Dimension
                            </DefaultButton>
                        )}
                    </div>
                    <div className="col-md-7">
                        {this.state.props.props.getRankingMethod() === 'Pareto' && (
                            this.state.props.props.getRankingDimensions().map((d: any) => (
                                <div key={this.state.props.props.getDimensionName(d)} className="row">
                                    <div className="col-md-5">
                                        {/*//FIXME This dropdown dosent display the external script object name*/}
                                        {!this.editing && <p className="form-control-static">{this.state.props.props.getDimensionName(d)}</p>}
                                        {this.editing && (
                                            <Dropdown 
                                                options={this.state.props.objNames.map((o: any) => ({ key: o, text: o}))}
                                                selectedKey={this.state.props.props.getDimensionName(d)}
                                                onChange={(event, item) => {this.state.props.props.onDimensionChange(d, item); this.refreshPage();}}
                                            />
                                        )}
                                    </div>
                                    {/*//FIXME This dropdown cant select*/}
                                    <div className="col-md-2">
                                        {!this.editing && <p className="form-control-static">{this.state.props.props.getDimensionDirection(d)}</p>}
                                        {this.editing && (
                                            <Dropdown  
                                                options={this.state.props.paretoDirections.map((pd: any) => ({ key: pd, text: pd }))}
                                                selectedKey={this.state.props.props.getDimensionDirection(d)}
                                                onChange={(event, item) => {this.state.props.props.setDimensionDirection(d, item); this.refreshPage();}}
                                            />
                                        )}
                                        {this.editing && (
                                            <DefaultButton onClick={() => {this.state.props.props.removeParetoDimension(d); this.refreshPage();}}>
                                                <span className="glyphicon glyphicon-remove"></span> Remove Dimension
                                            </DefaultButton>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <hr />

                {/* //FIXME error in this.state.props.props.addScenario(p) and this.state.props.props.removeScenario that provents this.refreshPage();*/}
                <h4>
                    Scenario
                    {this.editing && (
                        <DefaultButton onClick={() => {this.state.props.props.addScenario(); this.refreshPage();}}>
                            <span className="glyphicon glyphicon-plus"></span>
                        </DefaultButton>
                    )}
                </h4>

                {this.state.props.config.scenarios.map((s:any, i:any) => (
                    <div key={i} className="form-group row" style={{ display: 'flex' }}>
                        <div className="col-md-4">
                            {!this.editing && <p className="form-control-static">{this.state.props.props.getScenario(s)}</p>}
                            {this.editing && (
                                <> 
                                    <input 
                                        id={`scenarios${i}`} 
                                        value={this.state.props.props.getScenario(s)}
                                        onChange={event => {this.state.props.props.setScenario(s, event.target.value); this.refreshPage();}}
                                        className="form-control input-fixed-size input-sm"
                                        style={{ width: '80%' }}
                                    />
                                    <DefaultButton onClick={() => {this.state.props.props.removeScenario(s); this.refreshPage();}}>
                                        <span className="glyphicon glyphicon-remove"></span>
                                    </DefaultButton>
                                </>
                            )}
                        </div>
                    </div>
                ))}

                <hr />

                {!this.editing && (
                    <DefaultButton onClick={() => { this.editing = true; this.refreshPage();}}>
                        <span className="glyphicon glyphicon-edit" aria-hidden="true"></span> Edit
                    </DefaultButton>
                )}
                {this.editing && (
                    <DefaultButton onClick={() => { this.editing = false; this.refreshPage(); }}>
                        <span className="glyphicon glyphicon-floppy-saved" aria-hidden="true"></span> Save
                    </DefaultButton>
                )}

                </form>
            </>
        );
    }
}