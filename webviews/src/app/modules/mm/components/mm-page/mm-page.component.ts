import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mm-page',
  templateUrl: './mm-page.component.html',
  styleUrls: ['./mm-page.component.scss']
})
export class MmPageComponent {

  @Input()
  path!: string;
  
  constructor() {
  }

}
