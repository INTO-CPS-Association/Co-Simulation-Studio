import MyLibrary from "../lib";
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
  delete (csvData) {
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


