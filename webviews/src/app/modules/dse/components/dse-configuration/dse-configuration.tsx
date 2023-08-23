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
                    <DefaultButton id="btn-edit" onClick={() => { props.editing = true }}>
                        Edit
                    </DefaultButton>
                )}
                {props.editing && (
                    <PrimaryButton id="btn-save" onClick={() => { props.editing = false }} style={{ marginRight: 10 }}>
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
                                options={props.cosimConfig.map(con => ({ key: con, text: props.props.experimentName(con) }))}
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
                                options={props.algorithms.map(algorithm => ({ key: algorithm.name, text: algorithm.name }))}
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
                                        options={props.geneticPopulationDistribution.map(pd => ({ key: pd, text: pd }))}
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
            </form>
        </>
	);
}