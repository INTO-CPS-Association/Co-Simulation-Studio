import * as React from 'react';
import { IconButton, DefaultButton, PrimaryButton, IButtonStyles} from '@fluentui/react/lib/Button';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';
import { DetailsList, IColumn} from '@fluentui/react/lib/DetailsList';
import { initializeIcons } from '@fluentui/font-icons-mdl2';

initializeIcons();
//important to be able to use icons
const buttonStyles = { root: { marginRight: 8 } };

type PanelProps = {
  handleClick: (index: number) => void;
  collums: any
};

//collums and handleClick is passed as probs to the PanelLight component.
export const PanelLight: React.FunctionComponent<PanelProps> = ( {handleClick, collums}) => {
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    let _columns: IColumn[] = [
      { key: 'CollumHeader', name: 'CollumHeader', fieldName: 'CollumHeader', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Remove', name: 'Remove', fieldName: 'Remove', minWidth: 100, maxWidth: 200, isResizable: true, 
      onRender: (item: any) => (
        <div>
          {item.name}
          <IconButton
            menuIconProps={{ iconName: 'Hide3' }}
            role="button"
            aria-haspopup
            aria-label="Hide"
            onClick={() => handleClick(getindex(GetCollumHeader(item)))}
          />
        </div>
      )
      },
    ]; //item is the buttom that is pressed

    const GetCollumHeader = (item: any) => {
      return item.CollumHeader
    }
    const GetCollumsLength = (collums: any) => {
      return collums.length;
    }
    const GetCollumsKey = (collums: any) => {
      return collums.key;
    }

    const getindex = (name: any):number => {
      for (let i = 0; i < GetCollumsLength(collums); i++) {
        if(GetCollumsKey(collums[i]) === name)
          return i
      }
      return -1
    }
    
    const items = require("./Headers.json")
    
    const _detailslist = (<DetailsList
        items={items}
        columns={_columns}
      /> )
      
    const onRenderFooterContent = React.useCallback(
        () => (
          <div>
            <DefaultButton onClick={dismissPanel}>Back</DefaultButton>
          </div>
        ),
        [dismissPanel],);
    return (
      <div>
        <DefaultButton text="Menu" onClick={openPanel} />
        <Panel
            isLightDismiss
            isOpen={isOpen}
            onDismiss={dismissPanel}
            closeButtonAriaLabel="Close"
            headerText="Menu"
            onRenderFooterContent={onRenderFooterContent}
            isFooterAtBottom={true}
            customWidth='500px'
            type={PanelType.custom}
        >
            {_detailslist}
            
        </Panel>
      </div>
    );
  };