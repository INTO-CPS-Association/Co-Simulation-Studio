import React, { useState } from 'react';
import {Slider, Checkbox, PrimaryButton, MessageBar, MessageBarType} from '@fluentui/react';

//use this
export default function DseCoeLaunch(props: any) {
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
            <div>App COE Launch Component Placeholder</div>
			

            <div>
                <label>Max threads for DSE:</label>
                <Slider
                    min={1}
                    max={25}
                    value={props.threadCount}
                    onChange={props.updateThreadCount()}
                />
            </div>

            <Checkbox
                label="Generate HTML output"
                checked={props.generateHTMLOutput}
                onChange={(e, isChecked) => props.setGenerateHTMLOutput(isChecked)}
            />

            <Checkbox
                label="Generate CSV output"
                checked={props.generateCSVOutput}
                onChange={(e, isChecked) => props.setGenerateCSVOutput(isChecked)}
            />

            <PrimaryButton
                disabled={!props.canRun()}
                onClick={props.runDse()}
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