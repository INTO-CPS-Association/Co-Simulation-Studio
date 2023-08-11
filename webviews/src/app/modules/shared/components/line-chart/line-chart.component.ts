import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
var Plotly = require('plotly.js-dist')

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  private loading: boolean = true;
  private redrawCooldown: boolean = false;
  private _resizeNode: any;

  private lastUpdateTime: number = 0;
  private lastDatasets!: Array<any>;
  //https://plot.ly/javascript/reference/#layout
  private layout = {
    legend: {
      orientation: "v",
      x: 0,
      y: -0.1,
      xanchor: "left",
      yanchor: "top",
      tracegroupgap: 20
    },
    margin: {
      l: 25, r: 25, b: 25, t: 25, pad: 0
    },
    xaxis: {
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      showline: false
    },
    showlegend: true,
  };

  private options = {
    displaylogo: false
  };

  constructor(private element: ElementRef) {

  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeEventListener);
  }

  //FIXME Behavior subject is non-angular interface 
  @Input()
  set datasets(datasets: BehaviorSubject<any> | undefined) {

    datasets?.subscribe(datasets => { this.lastDatasets = datasets; this.redraw(datasets) });
  }

  @Input()
  set finished(isFinished: boolean) {

    if (isFinished) {
      this.draw(this.lastDatasets);
    }
  }

  //FIXME input something is not used? maybe should be deleted 
  @Input()
  set something(something: any) {
    this.redrawLayoutChange();
  }

  //FIXME plotly is non-angular interface 
  private redrawLayoutChange() {
    let node = Plotly.d3
      .select(this.element.nativeElement)
      .style({
        width: '100%',
        height: '80vh',
        display: 'block',

      })
      .node();
    //FIXME plotly is non-angular interface 
    Plotly
      .newPlot(node, [], this.layout, this.options)
      .then(() => this.loading = false);
    //FIXME plotly is non-angular interface 
    Plotly.Plots.resize(node);
  }

  private visibleRows: number = 1;

  @Input()
  set livegraphvisiblerowcount(rows: number) {
    if (rows < 1)
      rows = 1;
    this.visibleRows = rows;
    // let node = Plotly.d3
    //     .select(this.element.nativeElement)
    //     .style({
    //         width: '100%',
    //         height: this.visibleRows + 'vh',
    //         display: 'block',

    //     })
    //     .node();
    this.redrawLayoutChange();
  }

  ngOnInit() {
    this._resizeNode = Plotly.d3
      .select(this.element.nativeElement)
      .style({
        width: '100%',
        height: (80 / this.visibleRows) + 'vh',
        display: 'block',

      })
      .node();
      //FIXME plotly is non-angular interface 
    Plotly
      .newPlot(this._resizeNode, [], this.layout, this.options)
      .then(() => this.loading = false);

    window.addEventListener('resize', this.resizeEventListener);
  }
//FIXME plotly is non-angular interface 
  private resizeEventListener = () => {
    Plotly.Plots.resize(this._resizeNode)
  };

  private draw(datasets: Array<any>) {
    this.element.nativeElement.data = datasets;
    requestAnimationFrame(() => {
      //FIXME plotly is non-angular interface 
      Plotly.redraw(this.element.nativeElement);
      this.redrawCooldown = false;
      this.lastUpdateTime = Date.now();
    });
  }

  private redraw(datasets: Array<any>) {
    if (this.loading) return;

    if (this.redrawCooldown === false && Date.now() - this.lastUpdateTime > 150) {
      this.redrawCooldown = true;
      this.draw(datasets);
    }
  }

}
