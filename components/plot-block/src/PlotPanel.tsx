import * as React from 'react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';
import { Label } from '@fluentui/react/lib/Label';
import { TextField } from '@fluentui/react/lib/TextField';
import { useId } from '@fluentui/react-hooks';
import { PanelColorPicker } from './ColorPicker';
import { DropdownBasic } from './Dropdown';
import { IStackTokens, Stack } from '@fluentui/react/lib/Stack';

const buttonStyles = { root: { marginRight: 8 } };

export const PanelLight: React.FunctionComponent = () => {
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    const textFieldId = useId('anInput');
    /*
    const onRenderFooterContent = React.useCallback(
        () => (
          <div>
            <PrimaryButton onClick={dismissPanel} styles={buttonStyles}>
              Save
            </PrimaryButton>
            <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
          </div>
        ),
        [dismissPanel],);
        */

    return (
      <div>
        <br />
        <br />
        <DefaultButton text="Options" onClick={openPanel} />
        <Panel
            isLightDismiss
            isOpen={isOpen}
            onDismiss={dismissPanel}
            //closeButtonAriaLabel="Close"
            headerText="Options"
            /*
            onRenderFooterContent={onRenderFooterContent}
            isFooterAtBottom={true}
            */
            customWidth='500px'
            type={PanelType.custom}
        >   
            <Label htmlFor={textFieldId}>Data source</Label>
            <TextField id={textFieldId} />
            <Label htmlFor={textFieldId}>x axis</Label>
            <TextField id={textFieldId} />
            <Label htmlFor={textFieldId}>y axis</Label>
            <TextField id={textFieldId} />
            <br />
            <br />
            <br />
            <br />
            <br />
            <DropdownBasic />
            <PanelColorPicker />
        </Panel>
      </div>
    );
  };