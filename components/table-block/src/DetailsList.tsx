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
import {GitWorkDataBlock} from "./api"


//interfaces for the table
interface IDetailsListBasicExampleItem {
  Id: number
  Type: string
  Ppu: number
  Name: string
}
interface TableRow {
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
  private _table: GitWorkDataBlock;
  constructor(){
  
    
    super({});
    //initialize api and table
    this._table = new GitWorkDataBlock;
    this._table.getData();
    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() }),
    });
        
      let keys = this._table.getColumnNames();

      let _columns: IColumn[] = [];

      for(let i = 0; i < keys.length; i++){
        _columns.push({ key: keys[i], name: keys[i], fieldName: keys[i], minWidth: 100, maxWidth: 200, isResizable: true, showSortIconWhenUnsorted: true, isSorted:false });
      }
        //set states
        this.state = {
          items: this._table.data,
          column: _columns,
          selectionDetails: this._getSelectionDetails()
        
    };

    //auto update function
    this._table.on('update', (data: any) => {
      console.log("table has been updates")
      let keys = this._table.getColumnNames();

      let _columns: IColumn[] = [];

      for(let i = 0; i < keys.length; i++){
        _columns.push({ key: keys[i], name: keys[i], fieldName: keys[i], minWidth: 100, maxWidth: 200, isResizable: true, showSortIconWhenUnsorted: true, isSorted:false });
      }
        //set states
        this.setState({
          items: data,
          column: _columns,
          selectionDetails: this._getSelectionDetails()
        });
      })
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
    let items: any;
    let _allcolums = this.state.column;
    let collums = this._table.getColumnNames()
    //sort the data

    for (let i = 0; i < collums.length; i++) {
      if(collums[i] === csortColumn.key)
        if(sortOrder === "DESC")
          items = this._table.displayRows(collums[i], "DESC");
        else
           items = this._table.displayRows(collums[i], "ASC");

      
    }
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
      column: _allcolums,
    })
  }

  //function to remove a row
  private _RemoveRow(){
    this._table.deleteRow(this.state.selectionDetails);
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
    
    if(this._selection.getSelection()[0] as IDetailsListBasicExampleItem !== undefined)
    {
      return ((this._selection.getSelection()[0] as IDetailsListBasicExampleItem).Id)
    }
    return -1
  }

  private _onFilter = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string | undefined): void => {
    let _table = this.state.table;

    this.setState({
      
    });
  };
  
  render() {
    let { items } = this.state;
    let {column} = this.state;
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
    const searchfield = (<TextField
      label='filter'
      onChange={this._onFilter}
    />)
    //probities of table
    const _detailslist = (<DetailsList
      items={items}
      columns={column}
      setKey="set"
      isHeaderVisible = {true}
      selection={this._selection}
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
        {searchfield}
        {_detailslist}
      </div>
    );
  };
}