import React from 'react';
import { DetailsList, IColumn, Selection} from '@fluentui/react/lib/DetailsList';
import { PanelLight } from './SettingsPanel';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { Dialog, DialogType, DialogFooter, IDialogContentProps } from '@fluentui/react/lib/Dialog';
import { useBoolean } from '@fluentui/react-hooks';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { IComboBoxOption, IComboBoxStyles, VirtualizedComboBox } from '@fluentui/react';
import { Stack } from '@fluentui/react/lib/Stack';
import { IconButton, DefaultButton, PrimaryButton, IButtonStyles} from '@fluentui/react/lib/Button';
import {GitWorkDataBlock} from "./index"
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';


interface IDetailsListBasicExampleItem {
  Id: number
  Type: string
  Ppu: number
  Name: string
}
 interface IDetailsListBasicExampleState {
  items: IDetailsListBasicExampleItem[];
  selectionDetails: string;
}
type CommandbarProps = {
  _deleteRow: (Id: number) => void

};

const CommandBar_: React.FunctionComponent<CommandbarProps> = ({_deleteRow}) => {
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

  const TextField_ppu: React.FunctionComponent = () => {
    const [TextFieldValue, setTextFieldValue] = React.useState('');
    const onChangeFirstTextFieldValue = React.useCallback(
      (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setTextFieldValue(newValue || '');
      },
      [],
    );
    return (
        <TextField
          label="Type ppu"
          value={TextFieldValue}
          onChange={onChangeFirstTextFieldValue}
        />
    );
  };
  const TextField_name: React.FunctionComponent = () => {
    const [TextFieldValue, setTextFieldValue] = React.useState('');
    const onChangeFirstTextFieldValue = React.useCallback(
      (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setTextFieldValue(newValue || '');
      },
      [],
    );
    return (
        <TextField
          label="Type name"
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
        key: 'removeRow',
        text: 'Remove',
        iconProps: { iconName: 'Remove'},
        onClick: () => _deleteRow(1)
    }
  ];

  const DigalogProps: IDialogContentProps = {
    title: "Add"

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
          <Stack tokens={stackTokens} horizontalAlign="baseline">
            <ComboBox_type/>
            <TextField_ppu/>
            <TextField_name/>
            <DefaultButton onClick={toggleHideDialog} text="Cancel" />
          </Stack>
          </DialogFooter>
        </Dialog>
      </>
    </div>
  )
  }
export class DetailsListBasicExample extends React.Component<any, any, IDetailsListBasicExampleState> {
  private _selection: Selection;
  constructor(){
    super({});
    const _table = new GitWorkDataBlock();
    _table.getData();

    let columns = _table.getColumnNames();
    //declare colums
    let _columns: IColumn[] = [
      { key: columns[0], name: columns[0], fieldName: columns[0], minWidth: 100, maxWidth: 200, isResizable: true },
      { key: columns[1], name: columns[1], fieldName: columns[1], minWidth: 100, maxWidth: 200, isResizable: true },
      { key: columns[2], name: columns[2], fieldName: columns[2], minWidth: 100, maxWidth: 200, isResizable: true },
      { key: columns[3], name: columns[3], fieldName: columns[3], minWidth: 100, maxWidth: 200, isResizable: true},
    ];
    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() }),
    });

    //set states
    this.state = {
      items: _table.data,
      column: _columns,
      selectionDetails: this._selection,
      table: _table,
    };
  }
  
  private _RemoveRow(){
    const _table = this.state.table
    _table.deleteRow(this.state.selectionDetails);
    console.log(this.state.selectionDetails)

    //updates table
    this.setState({
      items: _table.data,
      //selectionDetails: this._getSelectionDetails(),
      table: _table,
    })
  };

  private _RemoveColumn(index:any) {
    let {column} = this.state;
    if(index >= 0){
      this.setState({
        column: column.slice(0, index).concat(column.slice(index+1)) 
      });
    }
  }
 private _getSelectionDetails(): number {
    const selectionCount = this._selection.getSelectedCount();
    console.log(this._selection.getSelection()[0])
    if ((this._selection.getSelection()[0])) {
    return (this._selection.getSelection()[0] as IDetailsListBasicExampleItem).Id;
    }
    return 99
     
  }
  render() {
    let { items } = this.state;
    let {column} = this.state;
    let {table} = this.state;
    let {selectionDetails} = this.state;
    
    const _RemoveColumn = (index: any) => {
      this._RemoveColumn(index);
    }
    const _deleteRow = () => {
      this._RemoveRow();
    }
    const _detailslist = (<DetailsList
      items={items}
      columns={column}
      setKey="set"
      isHeaderVisible = {true}
      selection={selectionDetails}
      selectionPreservedOnEmptyClick={true}
      ariaLabelForSelectionColumn="Toggle selection"
      ariaLabelForSelectAllCheckbox="Toggle selection for all items"
      checkButtonAriaLabel="select row"
    />)
    
    return (
      <div>
        <PanelLight handleClick={_RemoveColumn} columns={column}/>
        <CommandBar_ _deleteRow = {_deleteRow} />
        {_detailslist}
      </div>
    );
  };
}