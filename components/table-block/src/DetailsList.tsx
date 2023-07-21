// -------------------------------IMPORTS -------------------------------
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
import { Dropdown, DropdownMenuItemType, IDropdownStyles, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';


//-------------------------COMANDBAR COMPONENT 
//function to pass the the coomandbar component
type CommandbarProps = {
  _deleteRow: () => void
  filter_columns: IColumn[] 
  multSearch: (column: any, SortOrder: any) => void
};


//create commandbart which can add or remove
const CommandBar_: React.FunctionComponent<CommandbarProps> = ({_deleteRow , filter_columns, multSearch}) => {
  const stackTokens = { childrenGap: 15 };

  
// ------------------------ADD functionallity ---------------------
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

// ----------------------Sort on multiple collums funtionallity-------------------
  
  //set options 
  const options_columns: IDropdownOption[] = []
  for(let i = 0; i<filter_columns.length; i++){
    options_columns.push({key: filter_columns[i].key, text: filter_columns[i].name})
  }
  const sort_columns: IDropdownOption[] = [
    {
      key: "ASC", 
      text: "ASC"
    },
    {
      key: 'DESC',
      text: 'DESC'
    }
  ];

  //dialog variables
  const [hideAddDialog, { toggle: toggleHideAddDialog }] = useBoolean(true);
  //panel variables 
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [selectedcolumn, setSelectedcolumn] = React.useState<IDropdownOption>();
  const [selectedSortorder, setSelectedSortorder] = React.useState<IDropdownOption>();
  const [indexcounter, setindex] = React.useState<number>(0);
  const [data, setData] = React.useState<any>([{ key: indexcounter, name: indexcounter}]);
  
  const AddDigalogProps: IDialogContentProps = {
    title: "Add"
  }
   //create the two options and assign onClick functions.
  const _items: ICommandBarItemProps[] = [
    {
      key: 'addItem',
      text: 'Add',
      iconProps: { iconName: 'Add' },
      onClick: () => toggleHideAddDialog()
    },
    {
        key: 'removeRow',
        text: 'Remove',
        iconProps: { iconName: 'Remove'},
        onClick: () => _deleteRow()
    },
    {
        key: 'MulSort',
        text: 'Sort on muliple collums',
        iconProps: { iconName: 'Filter'},
        onClick: () => openPanel()
    },
    {
        key: 'Saverow',
        text: 'Save row for template',
        iconProps: { iconName: 'Save'},

    }  
  ];
// -------------------------THE SORT TABLE ------------------------------------

  //Set table collums
  let _columns: IColumn[] = [
    { key: 'ColumnSort', name: 'ColumnSort', fieldName: 'ColumnSort', minWidth: 100, maxWidth: 200, isResizable: true,
      onRender: (item) => (
        <Dropdown
          options={options_columns}
          defaultSelectedKey={options_columns[0].key}
          styles={{ dropdown: { width: 150 } }}
          onChange = {onChangecolumn}
        />
      ), },
    { key: 'SortOrder', name: 'SortOrder', fieldName: 'SortOrder', minWidth: 100, maxWidth: 200, isResizable: true,
      onRender: (item) => (
        <Dropdown
          options={sort_columns}
          defaultSelectedKey={sort_columns[0].key}
          styles={{ dropdown: { width: 150 } }}
          onChange={onChangeSortOrder}
          
        />
      ),
  },
  ];
  const addrow = (data: any) => {
    setindex(indexcounter + 1)
     
     data.push({key: indexcounter+1, name: indexcounter+1})
     setData(data)
  }
  const _table = <DetailsList
    items = {data}
    columns={_columns}
    />
  const onRenderFooterContent = React.useCallback(
    () => (
      <div>
        <DefaultButton onClick={dismissPanel}>Back</DefaultButton>
      </div>
    ),
    [dismissPanel],
    );

    const onChangecolumn = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined): void => {
      setSelectedcolumn(option);
    };
    const onChangeSortOrder = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption | undefined): void => {
      setSelectedSortorder(option);
    };

  // ---------------------------------------RETURN CONTENT --------------------------------
  return (

    <div>
      <CommandBar items={_items} />
      <>
        <Dialog
        //add dialog 
          dialogContentProps={AddDigalogProps}
          hidden={hideAddDialog}
          onDismiss={toggleHideAddDialog}
        >
          <DialogFooter>
          <Stack tokens={stackTokens} horizontalAlign="baseline">
            <ComboBox_type/>
            <TextField_ppu/>
            <TextField_name/>
            <DefaultButton onClick={toggleHideAddDialog} text="Cancel" />
          </Stack>
          </DialogFooter>
        </Dialog>

        <Panel
        //sort dialog 
          isLightDismiss
          isOpen={isOpen}
          onDismiss={dismissPanel}
          headerText="Sort on multiple rows"
          onRenderFooterContent={onRenderFooterContent}
          isFooterAtBottom={true}
          customWidth='500px'
          type={PanelType.custom}
          
        >
        {_table}
          <DefaultButton 
          label='Save'
          text='Save'
          onClick={() => {multSearch(selectedcolumn, selectedSortorder)}}
          />
          <DefaultButton 
          label='Add new '
          text='Add new'
          onClick={() => {addrow(data)}}
          />
        </Panel>
      </>
    </div>
  )
  }

// --------------------------TABLE COMPONENT ------------------------------
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
  // saves row for template 
  private _saverowfortemplate() {
    
  }
  //gets the row that is clicked 
  private _getSelectionDetails(): number {
    
    if(this._selection.getSelection()[0] as IDetailsListBasicExampleItem !== undefined)
    {
      console.log(this._selection.getSelection()[0] as IDetailsListBasicExampleItem)
      return ((this._selection.getSelection()[0] as IDetailsListBasicExampleItem).Id)
    }
    return -1
  }

  //searchfilter funcition 
  private _onFilter = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, TextInput: string | undefined): void => {
    //gets items the the original table
    let items: IDetailsListBasicExampleItem[];
    items = this._table.data
    //update the table in regards to Textput
    this.setState({
      items: TextInput ? items.filter(i => i.Name.toLowerCase().indexOf(TextInput) > -1) :items,
    });
  };

  private multSearch = (column: any, SortOrder: any): void => {
    let sorted_items = this._table.displayRows(column.key, SortOrder.key);
    this.setState ({
      items: sorted_items
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
    //make the textfield shorter 
    const textFieldStyles: Partial<ITextFieldStyles> = { root: { maxWidth: '300px' } };
    //function to sortColumn. sorts accending on default 
    const _onColumnClick = (event: React.MouseEvent<HTMLElement> |  undefined, column: IColumn | undefined): void => {
      if (column != undefined)
      {
      this._sortcolumn(column, "ASC")
      }
    }
    //proberties of searchfield 
    const searchfield = (<TextField
      label='Search field'
      onChange={this._onFilter}
      styles={textFieldStyles}
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
        <CommandBar_ _deleteRow = {_deleteRow}  filter_columns={column} multSearch = {this.multSearch}/>
        {searchfield}
        {_detailslist}
      </div>
    );
  };
}


//select a row and safe it as a template. 
//when you add a row it should give you a dropdown meneu of saved templated 