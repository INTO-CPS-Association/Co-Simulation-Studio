// -------------------------------IMPORTS -------------------------------
import React from 'react';
import { DetailsList, IColumn, Selection} from '@fluentui/react/lib/DetailsList';
import { PanelLight } from './SettingsPanel';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import {GitWorkDataBlock} from "./api"
import {CommandBar_} from './_Commandbar'


// --------------------------TABLE COMPONENT ------------------------------
//interfaces for the table
export interface IDetailsListBasicExampleItem {
  Id: number
  Type: string
  Ppu: number
  Name: string
}
 export interface IDetailsListBasicExampleState {
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
          selectionDetails: this._getSelectionDetails(),
          saved_templates: [],
          showDialog: false
    };

    //auto update function
    this._table.on('update', (data: any) => {
      let keys = this._table.getColumnNames();

      let _columns: IColumn[] = [];

      for(let i = 0; i < keys.length; i++){
        _columns.push({ key: keys[i], name: keys[i], fieldName: keys[i], minWidth: 100, maxWidth: 200, isResizable: true, showSortIconWhenUnsorted: true, isSorted:false });
      }
        //set states
        this.setState({
          items: data,
          column: _columns,
          selectionDetails: this._getSelectionDetails(),
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
    if(this.state.selectionDetails){
    this._table.deleteRow(this.state.selectionDetails.Id);
    }
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

  //some nice to have dialog functionallity for later
  /*
  handleOpenDialog = () => {
    console.log("here")
    this.setState({
      showDialog: true
    });
    console.log(this.state.showDialog)
  };
  handleCloseDialog = () => {
    this.setState({ showDialog: false });
  };
  */
  // saves row for template 

  private _saverowfortemplate() {
    //togle dialog 
    if(this.state.selectionDetails !== undefined){
    this.state.saved_templates.push(this.state.selectionDetails)
    console.log(this.state.selectionDetails, 'Has been saved')
    }
    
  }
  //gets the row that is clicked 
  private _getSelectionDetails(): IDetailsListBasicExampleItem | undefined {
    
    if(this._selection.getSelection()[0] as IDetailsListBasicExampleItem !== undefined)
    {
      console.log(this._selection.getSelection()[0] as IDetailsListBasicExampleItem)
      return ((this._selection.getSelection()[0] as IDetailsListBasicExampleItem))
    }
    return undefined
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
    const savetemplate = () => {
      this._saverowfortemplate();
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
        <CommandBar_ _deleteRow = {_deleteRow}  filter_columns={column} multSearch = {this.multSearch} savetemplate = {savetemplate} savedtemplates = {this.state.saved_templates}/>
        {searchfield}
        {_detailslist}
      </div>
    );
  };
}