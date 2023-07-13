
/*import MyLibrary from "../lib";
import * as Papa from 'papaparse';
import {testData} from "./test-data";
const myLibraryInstance = new MyLibrary();

document.querySelector("body").innerHTML = `<h1>Hello World!</h1>`;

console.log("myLibraryInstance", myLibraryInstance);

'use strict'
const { BindingBase, HashMapDataset, Graph, PlanBuilder, Pipeline } = require('sparql-engine')
const level = require('level')
const levelgraph = require('levelgraph')

myLibraryInstance.myMethod(); 

//from https://github.com/Callidon/sparql-engine/blob/master/examples/n3.js
function formatTriplePattern (triple) {
  let subject = null
  let predicate = null
  let object = null
  if (!triple.subject.startsWith('?')) {
    subject = triple.subject
  }
  if (!triple.predicate.startsWith('?')) {
    predicate = triple.predicate
  }
  if (!triple.object.startsWith('?')) {
    object = triple.object
  }
  return { subject, predicate, object }
}


class CSVGraph extends Graph {

  constructor (db) {
    super()
    this._db = db
    
  }

  // Insert CSV data into levelgraph
  // Problem: when add a second Data set the index starts ad 0 agien
  insert(csvData): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      //Truns the cvsData into Papa.parse type
      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          //Then the data is spilt into triple Wiht sublect being the ordered number of observarions predicate bieng the type and object being its value
          for (var index in results.data){
            this._db.put({subject: index, predicate: Object.keys(results.data[index])[0], object: results.data[index][Object.keys(results.data[index])[0]] });
            this._db.put({subject: index, predicate: Object.keys(results.data[index])[1], object: results.data[index][Object.keys(results.data[index])[1]] });
            this._db.put({subject: index, predicate: Object.keys(results.data[index])[2], object: results.data[index][Object.keys(results.data[index])[2]] });
          }
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });   
  }

  // Delete CSV data from the levelgraph
  // Problem: Also problem with indexing allways starts at 0
  delete(csvData) {
    return new Promise<void>((resolve, reject) => {
      //Truns the cvsData into Papa.parse type
      Papa.parse(csvData, {
        header: true,
        complete: (results) => {
          // All identical data is removed from the levelgraph
          for (var index in results.data){
            this._db.del({subject: index, predicate: Object.keys(results.data[index])[0], object: results.data[index][Object.keys(results.data[index])[0]] });
            this._db.del({subject: index, predicate: Object.keys(results.data[index])[1], object: results.data[index][Object.keys(results.data[index])[1]] });
            this._db.del({subject: index, predicate: Object.keys(results.data[index])[2], object: results.data[index][Object.keys(results.data[index])[2]] });
          }
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  // Find triple in the levelgraph
  find(triple){
    // Promise the data when it is done
    return new Promise<any>((resolve, reject) => {
      //partitions the triple into usfull subject, predicate, object that can be used by get function of levelgraph
      const { subject, predicate, object } = formatTriplePattern(triple)
      // get findes all emelemts with the given information of subject, predicate, object  
      this._db.get({
        subject, 
        predicate, 
        object
      }, function process(err, results) {
        resolve(results)
      });
    });
  }
}

/*
//creat levelgraph
const db = levelgraph(level('2db'))


// test cases
const graph = new CSVGraph(db)
//add data one
graph.insert(testData)
//diffrent find test
const test1 = await graph.find({ subject: '?', predicate: 'time', object: '?' })
const test2 = await graph.find({ subject: '?', predicate: 'level', object: '?' })
const test3 = await graph.find({ subject: '?', predicate: 'valve', object: '?' })
const test4 = await graph.find({ subject: '?', predicate: '?', object: 'false' })
const test5 = await graph.find({ subject: '?', predicate: '?', object: 'true' })
const test6 = await graph.find({ subject: '?', predicate: 'time', object: 'true' })
const test7 = await graph.find({ subject: '0', predicate: '?', object: '?' })

console.log("Test1", test1)
console.log("Test2", test2)
console.log("Test3", test3)
console.log("Test4", test4)
console.log("Test5", test5)
console.log("Test6", test6)
console.log("Test7", test7)

//delet data
graph.delete(testData)
const test8 = await graph.find({ subject: '?', predicate: 'time', object: '?' })
//test to see if data is deleted
console.log("Test8", test8)
*/

//data sturtue for the example.json
interface TableRow {
  Id: number
  Type: string
  Ppu: number
  Name: string
}

//create types for sort filter and callback
type SortOrder = "ASC" | "DESC";
type FilterCriteria = {column: keyof TableRow, value: any};
type Callback = (data?: any) => void;

// Maybe change name
export class GitWorkDataBlock {
  //data is the data that is stored in the table
  data: TableRow[];
  //eventListeners is a list of all the eventListeners
  private eventListeners: { [key: string]: Callback[] };

  //constructor
  constructor(data: TableRow[] = []) {
    this.data = data;
    this.eventListeners = {};
  }

  //add event listener
  on(eventName: string, callback: Callback): void {
    if (!this.eventListeners[eventName]) {
      this.eventListeners[eventName] = [];
    }
    this.eventListeners[eventName].push(callback);
  }

  //emit event
  private emit(eventName: string, data?: any): void {
    if (this.eventListeners[eventName]) {
      this.eventListeners[eventName].forEach(callback => callback(data));
    }
  }

  //As a test it just loads the example.json
  getData(): void {
    const items = require("./example.json")

    const GetItemsLength = (items: any) => {
      return items.length
    }
    for (let i = 0; i < GetItemsLength(items); i++) {
      //adds items to collu
      let item = {} as TableRow;
      item.Id = items[i].id;
      item.Type = items[i].type;
      item.Name = items[i].name;
      item.Ppu = items[i].ppu;
      this.data.push(item);
    }
    this.emit('update', this.data);
  }

  //delete row from the table
  deleteRow(Id: number): void {
    this.data = this.data.filter(row => row.Id !== Id);
    this.emit('update', this.data);
  }

  //update row in the table
  displayRows(sortColumn: keyof TableRow, sortOrder: SortOrder = "ASC", filter: FilterCriteria | null = null): TableRow[] {
    let result = [...this.data];
    //filter the data
    if (filter) {
      result = result.filter(row => row[filter.column] === filter.value);
    }
    //sort the data
    result.sort((a, b) => {
      if (a[sortColumn] < b[sortColumn]) {
        return sortOrder === "ASC" ? -1 : 1;
      } else if (a[sortColumn] > b[sortColumn]) {
        return sortOrder === "ASC" ? 1 : -1;
      } else {
        return 0;
      }
    });
    // return the result
    return result;
  }
  //For the table front end to get the column names of the TableRow
  getColumnNames(): (keyof TableRow)[] {
    // If data is empty, return an empty array
    if (this.data.length === 0) { return []; }
    // If data is guaranteed to be non-empty, you can take the first element
    let firstElement = this.data[0];

    // Extract keys
    let keys = Object.keys(firstElement);

    // You might need to cast these keys back to (keyof TableRow)[]
    return keys as (keyof TableRow)[];
  }
}
/*
//test cases
// create a new table
let table = new GitWorkDataBlock();

// register a callback to log whenever the table data is updated
table.on('update', (data) => {
  console.log('Table data updated: ', data);
});

table.getData();

// test the table sorting
console.log("Ask for table data ASC:", table.displayRows("Id", "ASC"))
console.log("Ask for table data DESC:", table.displayRows("Id", "DESC"))
// test the table with delete
table.deleteRow(1)
console.log("Ask for table data ASC after delet of id 0001:", table.displayRows("Id", "ASC"))
// test the table with filter
console.log("Ask for table data filter for id 0003:", table.displayRows("Id", "ASC", {column: "Id", value: "0003"}))
console.log("Ask for table data filter for name Old Fashioned:", table.displayRows("Id", "ASC", {column: "Name", value: "Old Fashioned"}))

*/