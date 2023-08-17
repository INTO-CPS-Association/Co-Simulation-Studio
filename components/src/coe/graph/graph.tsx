import React, { Component } from 'react';
//import { HttpClient } from '@angular/common/http'; // This import is not used in React
//import { NgZone } from '@angular/core'; // This import is not used in React
//import { LiveGraph } from 'src/app/modules/shared/classes/co-simulation-config'; // Adjust the path accordingly
//import { Graph } from 'src/app/modules/shared/classes/graph'; // Adjust the path accordingly
//import { FileSystemService } from 'src/app/modules/shared/services/file-system.service'; // Adjust the path accordingly

class GraphComponent extends Component{
  private graph: any; //FIXME
  private dataObj: any
  constructor(props:any) {
    
    super(props);
    //FIXME: This Uses a non Angular interface
    //this.graph = new Graph();
    this.graph = this.getGraph();
    console.log("Graph Window App Component");
  }

  initializeGraph() {
    const data = new URLSearchParams(window.location.search);
    const dataParam = data.get("data");
    if (dataParam){
    this.dataObj = JSON.parse(dataParam) ?? { graphMaxDataPoints: 0, title: "test", livestream: {} };
    }

    
    this.graph.setGraphMaxDataPoints(this.dataObj.graphMaxDataPoints);
    //FIXME: This Uses a non Angular interface
    //const lg = new LiveGraph();
    const lg = this.getLiveGraph();
    //lg.fromObject(this.dataObj.livestream, this.dataObj.title);
    this.graph.initializeSingleDataset(lg);
    this.graph.launchWebSocket(this.dataObj.webSocket);
    

    window.onbeforeunload = (ev) => {
      this.graph.closeSocket();
    };
  }

  getLiveGraph(){
    let lg = "lg"
    return lg
  }
  getGraph(){
    let graph = "graph"
    return graph
  }

  componentDidMount() {
    console.log("Graph Window App Component On Init");
    this.initializeGraph();
  }

  customTrackBy(index: number, obj: any) {
    return index;
  }

  render() {
    return (
      <div className="app-graph">
      </div>
    );
  }
}

export default GraphComponent;
