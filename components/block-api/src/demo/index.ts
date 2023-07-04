import MyLibrary from "../lib";
import {testData} from "./test-data";
import * as Papa from 'papaparse';
const myLibraryInstance = new MyLibrary();

document.querySelector("body").innerHTML = `<h1>Hello World!</h1>`;

console.log("myLibraryInstance", myLibraryInstance);

// Define a type of the data. 
type MyRow = {
    time: number,
    level: number,
    valve: boolean,
};

// Parse the CSV data
const results = Papa.parse<MyRow>(testData, {header: true});

// Dump the data to the console
console.log("results: ", results);

myLibraryInstance.myMethod(); 