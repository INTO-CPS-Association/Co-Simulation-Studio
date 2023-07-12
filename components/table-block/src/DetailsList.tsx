import React from 'react';
import { DetailsList, IColumn } from '@fluentui/react/lib/DetailsList';
import { PanelLight } from './SettingsPanel';

interface IDetailsListBasicExampleItem {
  Id: number
  Type: string
  Ppu: number
  Name: string
}
export class DetailsListBasicExample extends React.Component<any, any> {

  private _RemoveColumn(index:any) {
    let {column} = this.state;
    if(index >= 0){
      this.setState({
        column: column.slice(0, index).concat(column.slice(index+1)) 
      });
    }
  }
  constructor(){
    
    super({});

    //gets local json file for table commum
    const API_RequestData_Table = (path: string) => {
      const items = require("./example.json")
      return items
    }
    const items = API_RequestData_Table("./example.json");

    const GetItemsLength = (items: any) => {
      return items.length
    }
    let _allItems_: IDetailsListBasicExampleItem[] = [];
    for (let i = 0; i < GetItemsLength(items); i++) {
      //creates a empty instance of IdetailsListBasicExampleItem
      let item = {} as IDetailsListBasicExampleItem;
      //adds items to colum
      item.Id = items[i].id;
      item.Type = items[i].type;
      item.Name = items[i].name;
      item.Ppu = items[i].ppu;
      _allItems_.push(item);
    };

    //declare colums
    let _columns: IColumn[] = [
      { key: 'Id', name: 'Id', fieldName: 'Id', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Type', name: 'Type', fieldName: 'Type', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'ppu', name: 'ppu', fieldName: 'Ppu', minWidth: 100, maxWidth: 200, isResizable: true },
      { key: 'Name', name: 'Name', fieldName: 'Name', minWidth: 100, maxWidth: 200, isResizable: true},
    ];

    //set states
    this.state = {
      items: _allItems_,
      column: _columns
    };

  }
  render() {
    let { items } = this.state;
    let {column} = this.state;
    const _RemoveColumn = (index: any) => {
      this._RemoveColumn(index);
    }
    const _detailslist = (<DetailsList
      items={items}
      columns={column}
      setKey="set"
      isHeaderVisible = {true}
    />)
    
    return (
      <div>
        <PanelLight handleClick={_RemoveColumn} colums={column}/>
        {_detailslist}
      </div>
    );
  };
}