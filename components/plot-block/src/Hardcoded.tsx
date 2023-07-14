import { VegaLite, createClassFromSpec, VisualizationSpec } from "react-vega";

export const data1 = {
    myData: [
      { a: "A", b: 20 },
      { a: "B", b: 34 },
      { a: "C", b: 55 },
      { a: "D", b: 19 },
      { a: "E", b: 40 },
      { a: "F", b: 34 },
      { a: "G", b: 91 },
      { a: "H", b: 78 },
      { a: "I", b: 25 },
    ],
  };
  
  // Second data set to illustrate how data can be updated using buttons
  export const data2 = {
    myData: [
      { a: "A", b: 28 },
      { a: "B", b: 55 },
      { a: "C", b: 43 },
      { a: "D", b: 91 },
      { a: "E", b: 81 },
      { a: "F", b: 53 },
      { a: "G", b: 19 },
      { a: "H", b: 87 },
      { a: "I", b: 52 },
    ],
  };
  
  //Vertical bar plot
  export const spec1: VisualizationSpec = {
    data: { name: "myData" },
    description: "A simple bar chart with embedded data.",
    encoding: {
      x: { field: "a", type: "ordinal" },
      y: { field: "b", type: "quantitative" },
      color: { value: "#f5d0d0" },
    },
    mark: 'bar',
  };
  
  /*Horizontal bar plot*/
  export const spec2: VisualizationSpec = {
    data: { name: "myData" },
    description: "A simple bar chart with embedded data.",
    encoding: {
      x: { field: "b", type: "quantitative" },
      y: { field: "a", type: "ordinal" },
    },
    mark: "bar",
  };
  
  
  /*Scatterplot plot*/
  export const spec3: VisualizationSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: {url: "https://vega.github.io/vega-lite/examples/data/cars.json"},
    description: "A scatterplot showing horsepower and miles per gallons for various cars.",
    mark: "point",
    encoding: {
      x: { field: "Horsepower", type: "quantitative" },
      y: { field: "Miles_per_Gallon", type: "quantitative" }
    }
    
  }
  
  /*Lineplot plot*/
  export const spec4: VisualizationSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
    data: {url: "https://vega.github.io/vega-lite/examples/data/stocks.csv"},
    description: "Google's stock price over time.",
    transform: [{"filter": "datum.symbol==='GOOG'"}],
    mark: "line",
    encoding: {
      x: { field: "date", type: "temporal" },
      y: { field: "price", type: "quantitative" }
    },
  };