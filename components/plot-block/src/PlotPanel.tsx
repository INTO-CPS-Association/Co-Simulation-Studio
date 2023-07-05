import * as React from 'react';
import { Panel } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';

export function OPENPANEL(){
    const [isOpen, { setFalse: openPanel, setFalse: dismissPanel }] = useBoolean(false);

    return (
        <div>
        <Panel
            onOpen={openPanel}
            isLightDismiss
            isOpen={isOpen}
            onDismiss={dismissPanel}
            closeButtonAriaLabel="Close"
            headerText="Light dismiss panel"
        >
        </Panel>
        </div>
    );
};
