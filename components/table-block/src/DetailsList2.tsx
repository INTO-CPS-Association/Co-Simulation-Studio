import React from 'react';
import { DetailsList, IColumn } from '@fluentui/react/lib/DetailsList';
import { PanelLight } from './PlotPanel';

interface IDetailsListBasicExampleItem {
  Id: number
  Type: string
  Ppu: number
  Name: string
}

export class DetailsListBasicExample extends React.Component<any, any> {

  private RemoveCollum(index:any) {
    let {collum} = this.state;
    if(index >= 0){
      this.setState({
        collum: collum.slice(0, index).concat(collum.slice(index+1)) 
      });
    }
  }
  constructor(){
    
    super({});

    //gets local json file for table commum
    const items = require("./example.json")

    const GetItemsLength = (items: any) => {
      return items.length
    }
    let _allItems_: IDetailsListBasicExampleItem[] = [];
    for (let i = 0; i < GetItemsLength(items); i++) {
      //creates a empty instance of IdetailsListBasicExampleItem
      let item = {} as IDetailsListBasicExampleItem;
      //adds items to collum
      item.Id = items[i].id;
      item.Type = items[i].type;
      item.Name = items[i].name;
      item.Ppu = items[i].ppu;
      _allItems_.push(item);
    };

    //declare collums
    let _columns: IColumn[] = [
      { key: 'Id', name: 'Id', fieldName: 'Id', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Type', name: 'Type', fieldName: 'Type', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'ppu', name: 'ppu', fieldName: 'Ppu', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Name', name: 'Name', fieldName: 'Name', minWidth: 100, maxWidth: 200, isResizable: true},
    ];

    //set states
    this.state = {
      items: _allItems_,
      collum: _columns
    };

  }
  render() {
    let { items } = this.state;
    let {collum} = this.state;
    const _RemoveCollum = (index: any) => {
      this.RemoveCollum(index);
    }
    const _detailslist = (<DetailsList
      items={items}
      columns={collum}
      setKey="set"
      isHeaderVisible = {true}
    />)
    
    return (
      <div>
        <PanelLight handleClick={_RemoveCollum} collums={collum}/>
        {_detailslist}
      </div>
    );
  };
}
/*

/*
const exampleChildClass = mergeStyles({
  display: 'block',
  marginBottom: '10px',
});

const textFieldStyles: Partial<ITextFieldStyles> = { root: { maxWidth: '300px' } };

export interface IDetailsListBasicExampleItem {
  Id: number;
  Type: string
  Ppu: number
  Name: string
}
export interface IDetailsListBasicExampleState {
  items: IDetailsListBasicExampleItem[];
  selectionDetails: string;
}
export class DetailsListBasicExample extends React.Component<{}, IDetailsListBasicExampleState> {
  private _selection: Selection;
  private _allItems: IDetailsListBasicExampleItem[];
  private _columns: IColumn[];
  private _showHeaders: boolean;
  private _detailslist: any;
  
  constructor(props: {}) {
    super(props);

    
    this._showHeaders = false;
    this._selection = new Selection({
      onSelectionChanged: () => this.setState({ selectionDetails: this._getSelectionDetails() }),
    });

    //gets local json file for table commum
    const items = require("./example.json")
    
    this._allItems = []
    for (let i = 0; i < items.length; i++) {
      //creates a empty instance of IdetailsListBasicExampleItem
      let item = {} as IDetailsListBasicExampleItem;
      //adds items to collum
      item.Id = items[i].id;
      item.Type = items[i].type;
      item.Name = items[i].name;
      item.Ppu = items[i].ppu;
      this._allItems.push(item)
    }
    this._columns = [
      { key: 'column1', name: 'Id', fieldName: 'Id', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column2', name: 'Type', fieldName: 'Type', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column3', name: 'ppu', fieldName: 'Ppu', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'column4', name: 'Name', fieldName: 'Name', minWidth: 100, maxWidth: 200, isResizable: true,},
      ];
    
    this.state = {
      items: this._allItems,
      selectionDetails: this._getSelectionDetails(),
    };
    this._detailslist = (<DetailsList
      items={this._allItems}
      columns={this._columns}
      setKey="set"
      layoutMode={DetailsListLayoutMode.justified}
      selection={this._selection}
      selectionPreservedOnEmptyClick={true}
      ariaLabelForSelectionColumn="Toggle selection"
      ariaLabelForSelectAllCheckbox="Toggle selection for all items"
      checkButtonAriaLabel="select row"
      onItemInvoked={this._onItemInvoked}
    />)
    }
  private toggleHeaders = () => {
    this._showHeaders = !this._showHeaders;
    this.forceUpdate(); // Force re-render to update the UI
  };
  public render(): JSX.Element {
    const { items, selectionDetails } = this.state;
    
    return (
      <div>
        <div className={exampleChildClass}>{selectionDetails}</div>
        <Text>
          Note: While focusing a row, pressing enter or double clicking will execute onItemInvoked, which in this
          example will show an alert.
        </Text>
        <Announced message={selectionDetails} />
        <TextField
          className={exampleChildClass}
          label="Filter by name:"
          onChange={this._onFilter}
          styles={textFieldStyles}
        />
        <Announced message={`Number of items after filter applied: ${items.length}.`} />
        <MarqueeSelection selection={this._selection}>
          {this._detailslist}
        </MarqueeSelection>       
    </div> 
    );
  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' + (this._selection.getSelection()[0] as IDetailsListBasicExampleItem).Name;
      default:
        return `${selectionCount} items selected`;
    }
  }
//changed "text: number " to "type: any" -> fixed bug
  private _onFilter = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,  Name: any): void => {
    this.setState({
      items: Name ? this._allItems.filter(i => i.Name.toLowerCase().indexOf(Name) > -1) : this._allItems,
    });
  };

  private _onItemInvoked = (item: IDetailsListBasicExampleItem): void => {
    alert(`Item invoked: ${item.Name}`);
  };
}
export{}
*/