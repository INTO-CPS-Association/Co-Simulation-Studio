import React, { useState } from 'react';
import {Slider, Checkbox, PrimaryButton, MessageBar, MessageBarType} from '@fluentui/react';


export default function ReactExample(parseError: string | null, path: any, threadCount: number, generateHTMLOutput: boolean, generateCSVOutput: boolean, simSuccess: boolean, simFailed: boolean, resultPath: any) {
	return (
		<div>
            <h3>DSE Co-simulation</h3>

            {parseError && (
                <MessageBar
                    messageBarType={MessageBarType.error}
                    onDismiss={resetParseError()}
                    isMultiline={true}
                >
                    <p>Error: Could not run config.</p>
                    <p>Message: {parseError}</p>
                    <p>Path: {path}</p>
                </MessageBar>
            )}

            {/* This is a placeholder for the <app-coe-launch> component. Need to replace this with the equivalent React component */}
            <div>App COE Launch Component Placeholder</div>
			

            <div>
                <label>Max threads for DSE:</label>
                <Slider
                    min={1}
                    max={25}
                    value={threadCount}
                    onChange={updateThreadCount()}
                />
            </div>

            <Checkbox
                label="Generate HTML output"
                checked={generateHTMLOutput}
                onChange={(e, isChecked) => setGenerateHTMLOutput(isChecked)}
            />

            <Checkbox
                label="Generate CSV output"
                checked={generateCSVOutput}
                onChange={(e, isChecked) => setGenerateCSVOutput(isChecked)}
            />

            <PrimaryButton
                disabled={!canRun()}
                onClick={runDse()}
            >
                Simulate
            </PrimaryButton>
            
            {simSuccess && <span>Simulation successful</span>}
            {simFailed && <span>Simulation failed</span>}

            {resultPath && (
                <iframe src={resultPath} title="DSE Results" width="100%" height="500" style={{ border: 'none' }} />
            )}
        </div>
	);
}