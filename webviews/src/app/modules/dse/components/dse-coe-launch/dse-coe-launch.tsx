import React, { useState } from 'react';
import {Slider, Checkbox, PrimaryButton, MessageBar, MessageBarType} from '@fluentui/react';

//use this
export default function DseCoeLaunch(props: any) {
	console.log("hello",props)
	return (
		<div>
            <h3>DSE Co-simulation</h3>

            {props.parseError && (
                <MessageBar
                    messageBarType={MessageBarType.error}
                    onDismiss={props.resetParseError()}
                    isMultiline={true}
                >
                    <p>Error: Could not run config.</p>
                    <p>Message: {props.parseError}</p>
                    <p>Path: {props.path}</p>
                </MessageBar>
            )}

            {/* This is a placeholder for the <app-coe-launch> component. Need to replace this with the equivalent React component */}
			{/*<app-coe-launch></app-coe-launch> old code it is in the dse-coe-launch.component still*/}
            <div>App COE Launch Component Placeholder</div>
			

            <div>
                <label>Max threads for DSE:</label>
                <Slider
                    min={1}
                    max={25}
                    defaultValue={props.threadCount}
                    onChange={(value) =>props.props.updateThreadCount(value.toString())}
                />
            </div>
				
            <Checkbox
                label="Generate HTML output"
                defaultChecked={props.generateHTMLOutput}
                onChange={(e, isChecked) => props.props.setGenerateHTMLOutput(isChecked)}
            />

            <Checkbox
                label="Generate CSV output"
                defaultChecked={props.generateCSVOutput}
                onChange={(e, isChecked) => props.props.setGenerateCSVOutput(isChecked)}
            />

            <PrimaryButton
                disabled={!props.props.canRun()}
                onClick={() => props.props.runDse()}
            >
                Simulate
            </PrimaryButton>
            
            {props.simSuccess && <span>Simulation successful</span>}
            {props.simFailed && <span>Simulation failed</span>}

            {props.resultPath && (
                <iframe src={props.resultPath} title="DSE Results" width="100%" height="500" style={{ border: 'none' }} />
            )}
        </div>
	);
}