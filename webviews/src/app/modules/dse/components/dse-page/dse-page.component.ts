import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dse-page',
  templateUrl: './dse-page.component.html',
  styleUrls: ['./dse-page.component.scss']
})
export class DsePageComponent {

  @Input()
  path!: string;

  coeconfig: string = '';

  constructor() {
  }

  coeChangeEvent(config: string) {
    this.coeconfig = config;
  }
  
}
