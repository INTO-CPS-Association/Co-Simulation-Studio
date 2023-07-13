import * as React from 'react';
import { IconButton, DefaultButton, PrimaryButton, IButtonStyles} from '@fluentui/react/lib/Button';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';
import { DetailsList, IColumn} from '@fluentui/react/lib/DetailsList';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { IComboBoxOption, IComboBoxStyles, VirtualizedComboBox } from '@fluentui/react';
import { Dialog, DialogType, DialogFooter, IDialogContentProps } from '@fluentui/react/lib/Dialog';
import { IStyleSet, Label, ILabelStyles, Pivot, PivotItem } from '@fluentui/react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { Stack } from '@fluentui/react/lib/Stack';


//pivt + commandbart with add and remove. 
//click add opens dialog. fist row is a drop down with type. second URL (list files in current workspace), third add precix(text?)
/* 
one column with prefix, one column with import type (extends/uses), one column with URL, 
*/

initializeIcons();


export const CommandBar_: React.FunctionComponent = () => {
  const stackTokens = { childrenGap: 15 };
  const ComboBox_type: React.FunctionComponent = () => {
    
    const GetOptions = () => {
      const options: IComboBoxOption[] = [
        {
        key: `Extends`,
        text: `Extends`
        },
        {
        key: 'Uses',
        text: 'Uses'
        }
      ]
      return options;
    }
    const options = GetOptions();
    return (
      <VirtualizedComboBox
        label="Select type"
        allowFreeform
        autoComplete="on"
        options={options}
        dropdownMaxWidth={200}
        useComboBoxAsMenuWidth
      />
    );
  };

  const ComboBox_URL: React.FunctionComponent = () => {
    const GetUrl = () => {
      //should return list of files
      const options: IComboBoxOption[] = [
        {
        key: `1`,
        text: `URL1`
        },
        {
        key: '2',
        text: 'URL2'
        }
      ]
      return options
    }
    const options = GetUrl();
    return (
      <VirtualizedComboBox
        label="Select URL"
        allowFreeform
        autoComplete="on"
        options={options}
        dropdownMaxWidth={200}
        useComboBoxAsMenuWidth
      />
    );
  }
  const TextField_prefix: React.FunctionComponent = () => {
    const [TextFieldValue, setTextFieldValue] = React.useState('');
    const onChangeFirstTextFieldValue = React.useCallback(
      (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setTextFieldValue(newValue || '');
      },
      [],
    );
    return (
        <TextField
          label="Insert prefix"
          value={TextFieldValue}
          onChange={onChangeFirstTextFieldValue}
        />
    );
  };
   //Textfieldvalue contains the prefix. need to set up constaints for prefix format.
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const _items: ICommandBarItemProps[] = [
    {
      key: 'addItem',
      text: 'Add',
      iconProps: { iconName: 'Add' },
      onClick: () => toggleHideDialog()
      },
    {
      key: 'Remove',
      text: 'Remove',
      iconProps: { iconName: 'Remove' },
      onClick: () => console.log('Remove') 
    },
  ];
  const DigalogProps: IDialogContentProps = {
    title: "Add",
    styles: {
      content: '1 0 0'}

  }
  return (
    <div>
      <CommandBar items={_items} />
      <>
        <Dialog
          dialogContentProps={DigalogProps}
          hidden={hideDialog}
          onDismiss={toggleHideDialog}
        >
          <DialogFooter>
          <Stack tokens={stackTokens} horizontalAlign="space-evenly" verticalAlign='space-evenly'>
            <ComboBox_type/>
            <ComboBox_URL/>
            <TextField_prefix/>
            <DefaultButton onClick={toggleHideDialog} text="Cancel" />
          </Stack>
          </DialogFooter>
        </Dialog>
      </>
    </div>
  )
  }


type PivitPros = {
  _detaillist: any //should be type details list 
};

export const Pivot_: React.FunctionComponent<PivitPros> = ({_detaillist}) => {

  let _columns: IColumn[] = [
    { key: 'Oml_descripter', name: 'Descripter', fieldName: 'Descripter', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'Importtype', name: 'Import type', fieldName: 'Import type', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'Url', name: 'URL', fieldName: 'URL', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'Prefix', name: 'Prefix', fieldName: 'Prefix', minWidth: 100, maxWidth: 200, isResizable: true },
  ]
const API_RequestData_Viewlist = (path: any) => {
    const items = require("./oml_descriptors");
    return items
  };
  const GetItemsLength = (items:any) => {
    return items.length;
  }

  //still need to implement functionallity to display URL import type
  const items = API_RequestData_Viewlist("./oml_descriptors");
  console.log(items);
  const _detailslist_OML = (<DetailsList
    items={items}
    columns={_columns}
  /> )

  return (
    <div>
    <Pivot>
      <PivotItem headerText="Generel settings">
      {_detaillist}
      </PivotItem>
      <PivotItem headerText="OML settings">
        <CommandBar_/>
       {_detailslist_OML}
      </PivotItem>
    </Pivot>
    </div>
  );
};

type PanelProps = {
  handleClick: (index: number) => void
  columns: any
};
//colums and handleClick is passed as probs to the PanelLight component.
export const PanelLight: React.FunctionComponent<PanelProps> = ( {handleClick, columns}) => {
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    let _columns: IColumn[] = [
      { key: 'ColumnHeader', name: 'ColumnHeader', fieldName: 'ColumnHeader', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Remove', name: 'Remove', fieldName: 'Remove', minWidth: 100, maxWidth: 200, isResizable: true, 
      onRender: (item: any) => (
        <div>
          {item.name}
          <IconButton
            menuIconProps={{ iconName: 'Remove' }}
            role="button"
            aria-haspopup
            aria-label="Hide"
            onClick={() => handleClick(GetIndex(GetColunmsHeader(item)))}
          />
        </div>
      )
      },
    ]; //item is the buttom that is pressed

    const GetColunmsHeader = (item: any) => {
      return item.ColumnHeader
    }
    const GetColunmsLength = (columns: any) => {
      return columns.length;
    }
    const GetColunmssKey = (columns: any) => {
      return columns.key;
    }

    const GetIndex = (name: any):number => {
      for (let i = 0; i < GetColunmsLength(columns); i++) {
        if(GetColunmssKey(columns[i]) === name)
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
        <IconButton text="Settings" onClick={openPanel} 
        menuIconProps={{ iconName: 'Settings' }}
         />
        <Panel
            isLightDismiss
            isOpen={isOpen}
            onDismiss={dismissPanel}
            closeButtonAriaLabel="Close"
            headerText="Settings"
            onRenderFooterContent={onRenderFooterContent}
            isFooterAtBottom={true}
            customWidth='500px'
            type={PanelType.custom}
        >

            
            <Pivot_ _detaillist = {_detailslist}/>
            
 
        </Panel>
        
      </div>
    );
  };
