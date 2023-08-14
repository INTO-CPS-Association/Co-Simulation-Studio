import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { LiveGraph } from 'src/app/modules/shared/classes/co-simulation-config';
import { Graph } from 'src/app/modules/shared/classes/graph';
import { FileSystemService } from 'src/app/modules/shared/services/file-system.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  //FIXME: This Uses a non Angular interface
  graph: Graph = new Graph();

  constructor(private http: HttpClient,
    //FIXME: This Uses a non Angular interface
    private fileSystem: FileSystemService,
    private zone: NgZone) {
    console.log("Graph Window App Component")
  }

  initializeGraph() {
    /* let dataObj = JSON.parse(data); */
    let dataObj = JSON.parse(this.getParameterByName("data")) ?? {graphMaxDataPoints: 0, title: "test", livestream: {}};
    this.zone.run(() => {
      this.graph.setGraphMaxDataPoints(dataObj.graphMaxDataPoints);
      //FIXME: This Uses a non Angular interface
      let lg: LiveGraph = new LiveGraph();
      lg.fromObject(dataObj.livestream, dataObj.title);
      this.graph.initializeSingleDataset(lg);
      this.graph.launchWebSocket(dataObj.webSocket)
    });
    //FIXME: This is from electorn ipcRenderer and has to be replaced potescially
    // https://www.electronjs.org/docs/latest/api/ipc-renderer 
    //PL-TODO ipcRenderer.on('close', () => { this.graph.closeSocket(); this.graph.setFinished(); });
    window.onbeforeunload = ((ev: any) => {
      this.graph.closeSocket();
    });
  }

  // Retrieves the query string value associated with name
  private getParameterByName(name: string, url?: string): any {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  ngOnInit() {
    console.log("Graph Window App Component On Init");
    this.initializeGraph();
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

}
