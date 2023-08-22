import React, { Component } from 'react';
import { MessageBar, MessageBarType, PrimaryButton, Stack } from '@fluentui/react';

interface DSECoSimulationState {
  parseError: string | null;
  path: string | null;
}

class DseCoeLaunch extends Component<{}, DSECoSimulationState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      parseError: null,
      path: null,
    };
  }

  resetParseError = () => {
    this.setState({ parseError: null });
  };

  render() {
    const { parseError, path } = this.state;

    return (
      <div>
        <h3>DSE Co-simulation</h3>

        {parseError && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            onDismiss={this.resetParseError}
          >
            <p>Error: Could not run config.</p>
            <p>Message: {parseError}</p>
            <p>Path: {path}</p>
          </MessageBar>
        )}

        {/* Replace with your actual React component for app-coe-launch */}
        <div>App Coe Launch Component Here</div>

        <Stack horizontal>
          {/* Your form elements here */}
        </Stack>
      </div>
    );
  }
}

export default DseCoeLaunch;
