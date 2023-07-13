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


//interfaces for the table
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
//function to pass the the coomandbar component
type CommandbarProps = {
  _deleteRow: () => void

};
//create commandbart which can add or remove
const CommandBar_: React.FunctionComponent<CommandbarProps> = ({_deleteRow}) => {
  const stackTokens = { childrenGap: 15 };

  //create combobox to select type when adding
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

  //creates the textfield to contain ppu
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
  //create textfield to contain name 
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
          //Textfieldvalue contains the prefix. need to set up constaints for prefix format.
          onChange={onChangeFirstTextFieldValue}
        />
    );
  };
  //dialog variables
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const DigalogProps: IDialogContentProps = {
    title: "Add"
  }
   //create the two options and assign onClick functions.
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
        onClick: () => _deleteRow()
    }
  ];

  //content of commandbar
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
    //initialize api
    const _table = new GitWorkDataBlock();
    //get data from api
    _table.getData();

    let columns = _table.getColumnNames();
    //declare colums, still need to be 100% from api
    let _columns: IColumn[] = [
      { key: columns[0], name: columns[0], fieldName: columns[0], minWidth: 100, maxWidth: 200, isResizable: true, showSortIconWhenUnsorted: true, isSorted:false},
      { key: columns[1], name: columns[1], fieldName: columns[1], minWidth: 100, maxWidth: 200, isResizable: true, showSortIconWhenUnsorted: true, isSorted:false},
      { key: columns[2], name: columns[2], fieldName: columns[2], minWidth: 100, maxWidth: 200, isResizable: true, showSortIconWhenUnsorted: true, isSorted:false} ,
      { key: columns[3], name: columns[3], fieldName: columns[3], minWidth: 100, maxWidth: 200, isResizable: true, showSortIconWhenUnsorted: true, isSorted:false},
    ];
    
    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() }),
    });

    //set states with data from api
    this.state = {
      items: _table.data,
      column: _columns,
      selectionDetails: this._selection,
      table: _table,
    };
  }
  
  
  

  //function to sort collum ASC | DESC
  private _sortcolumn(csortColumn: IColumn, sortOrder: string){
    //first time sort is pressed
    if (csortColumn.isSorted === false)
    {
      csortColumn.isSortedDescending = false;
      csortColumn.isSorted = true;
      sortOrder = "ASC";
      console.log("1")
    }
    //the two cases after the first sort
    else if(csortColumn.isSorted === true && csortColumn.isSortedDescending === false){
      csortColumn.isSortedDescending = true;
      sortOrder = "DESC";
    }
    else{
      csortColumn.isSortedDescending = false;
      csortColumn.isSorted = true;
      sortOrder = "ASC";
    }
    //initialize variables to update table
    const _table = this.state.table;
    let items: any;
    let _allcolums = this.state.column;

    //sort the data
    items = _table.displayRows(csortColumn.key, sortOrder);
   
    //updates table with items returned
    for (let i = 0; i < _allcolums.length; i++) {
      if(_allcolums[i].key === csortColumn.key)
      {
        _allcolums[i] = csortColumn;
      }
      else{
        _allcolums[i].isSorted = false;
      }
    }
    this.setState({
      items: items,
      table: _table,
      column: _allcolums,
    })
  }

  //function to update table
  private _updateItems(_table: GitWorkDataBlock) {
    //updates table
    this.setState({
      items: _table.data,
      table: _table,
    })
  }
  //function to remove a row
  private _RemoveRow(){
    const _table = this.state.table
    _table.deleteRow(this.state.selectionDetails);

    this._updateItems(_table);
    
  };
//function to remove a collum - should be updated to use api
  private _RemoveColumn(index:any) {
    let {column} = this.state;
    if(index >= 0){
      this.setState({
        column: column.slice(0, index).concat(column.slice(index+1)) 
      });
    }
  }
  //gets the row that is clicked 
 private _getSelectionDetails(): number {
    const selectionCount = this._selection.getSelectedCount();
    if ((this._selection.getSelection()[0])) {
      return (this._selection.getSelection()[0] as IDetailsListBasicExampleItem).Id;
    }
    return -1
     
  }
  
  render() {
    let { items } = this.state;
    let {column} = this.state;
    let {selectionDetails} = this.state;

    //function to remove column
    const _RemoveColumn = (index: any) => {
      this._RemoveColumn(index);
    }
    //function to delete row
    const _deleteRow = () => {
      this._RemoveRow();
    }
    //function to sortColumn. sorts accending on default 
    const _onColumnClick = (event: React.MouseEvent<HTMLElement> |  undefined, column: IColumn | undefined): void => {
      if (column != undefined){
      this._sortcolumn(column, "ASC")
      }
    }
    //probities of table
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
      onColumnHeaderClick={_onColumnClick}
      
    />)
    
    return (
      //what the class displays
      <div>
        <PanelLight handleClick={_RemoveColumn} columns={column}/>
        <CommandBar_ _deleteRow = {_deleteRow} />
        {_detailslist}
      </div>
    );
  };
}