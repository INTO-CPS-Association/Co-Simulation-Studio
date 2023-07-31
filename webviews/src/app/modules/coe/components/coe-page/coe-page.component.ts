import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-coe-page',
  templateUrl: './coe-page.component.html',
  styleUrls: ['./coe-page.component.scss']
})
export class CoePageComponent {

  @Input()
  path!: string;

}
